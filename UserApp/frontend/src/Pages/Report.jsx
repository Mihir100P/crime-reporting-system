import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContext from "../context/authContext";
import { toast } from "react-toastify";

const accessToken = import.meta.env.VITE_MAP_TOKEN;

const ReportForm = ({handleSOS}) => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  const navigate = useNavigate();
  const { user, updateUserPoints } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const createReportMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }

      return await response.json();
    },
    onSuccess: async () => {
      if (user) {
        await updateUserPoints(user._id, 100);
      }
      reset();
      setFiles([]);
      setPreviewUrls([]);
      setLocation(null);
      setAddress("");
      setSubmitError("");
      toast.success("Report submitted successfully");
      navigate("/dashboard/user", {
        state: { success: true, message: "Report submitted successfully" }
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit report");
      setSubmitError(error.message || "Failed to submit report");
      setIsSubmitting(false);
    }
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls(newPreviewUrls);
  };

  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(latlng);
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${latlng.lng},${latlng.lat}.json?access_token=${accessToken}`
            );
            const data = await response.json();
            setAddress(data?.features?.[0]?.place_name || "Unknown location");
          } catch (error) {
            setAddress("Unable to determine address: " + error.message);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUseCurrentLocation(false);
        }
      );
    }
  }, [useCurrentLocation]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    let latitude = null;
    let longitude = null;
    let finalAddress = "";

    if (useCurrentLocation) {
      latitude = location?.lat;
      longitude = location?.lng;
      finalAddress = address;
    } else {
      finalAddress = data.manualAddress;
      try {
        const geocodeResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            finalAddress
          )}.json?access_token=${accessToken}`
        );
        const geocodeData = await geocodeResponse.json();
        const coords = geocodeData.features?.[0]?.center;
        if (!coords) throw new Error("Invalid manual address.");
        longitude = coords[0];
        latitude = coords[1];
      } catch (err) {
        setSubmitError("Manual address geocoding failed: " + err.message);
        setIsSubmitting(false);
        return;
      }
    }

    if (!latitude || !longitude || !finalAddress) {
      setSubmitError("Please provide a valid location");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("incidentType", data.incidentType);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("address", finalAddress);
    files.forEach((file) => formData.append("media", file));

    createReportMutation.mutate(formData);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="container py-5">
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>
      <h1 className="text-center mb-4" style={{color: "#721a06ff"}}>Report an Incident</h1>
      {submitError && <div className="alert alert-danger">{submitError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-lg box">
        <div className="mb-3">
          <label className="form-label">Incident Title</label>
          <input
            type="text"
            className="form-control box"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <div className="text-danger">{errors.title.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Incident Type</label>
          <select
            className="form-select box"
            {...register("incidentType", { required: "Incident type is required" })}
          >
            <option value="">Select incident type</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="burglary">Burglary</option>
            <option value="vandalism">Vandalism</option>
            <option value="fraud">Fraud</option>
            <option value="harassment">Harassment</option>
            <option value="violent">Violent</option>
            <option value="traffic offense">Traffic offense</option>
            <option value="suspicious">Suspicious Activity</option>
            <option value="other">Other</option>
          </select>
          {errors.incidentType && (
            <div className="text-danger">{errors.incidentType.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control box"
            rows="4"
            {...register("description", { required: "Description is required" })}
          ></textarea>
          {errors.description && (
            <div className="text-danger">{errors.description.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Media (Image/Video)</label>
          <input
            type="file"
            className="form-control box"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
          />
          <div className="mt-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Preview"
                className="img-thumbnail me-2 mb-2 box"
                style={{ maxWidth: "150px" }}
              />
            ))}
          </div>
        </div>

        <div className="mb-3 form-check form-switch">
          <input
            className="form-check-input box"
            type="checkbox"
            checked={useCurrentLocation}
            onChange={() => setUseCurrentLocation(!useCurrentLocation)}
          />
          <label className="form-check-label">Use Current Location</label>
        </div>

        {useCurrentLocation ? (
          <div className="mb-3">
            <label className="form-label">Detected Location</label>
            <p>{address || "Fetching current location..."}</p>
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label">Manual Address</label>
            <input
              type="text"
              className="form-control box"
              {...register("manualAddress", {
                required: "Manual address is required"
              })}
            />
            {errors.manualAddress && (
              <div className="text-danger">{errors.manualAddress.message}</div>
            )}
          </div>
        )}
        <div className="text-center">
        <button
          type="submit"
          className="btn btn-style gradient-text"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;



// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import "bootstrap/dist/css/bootstrap.min.css";
// import AuthContext from "../context/authContext";
// import { toast } from "react-toastify";

// const accessToken = import.meta.env.VITE_MAP_TOKEN;

// const ReportForm = () => {
//   const [files, setFiles] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [location, setLocation] = useState(null);
//   const [address, setAddress] = useState("");
//   const [submitError, setSubmitError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [useCurrentLocation, setUseCurrentLocation] = useState(true);

//   // Camera states
//   const [showCamera, setShowCamera] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [recordedChunks, setRecordedChunks] = useState([]);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const streamRef = useRef(null);

//   const navigate = useNavigate();
//   const { user, updateUserPoints } = useContext(AuthContext);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset
//   } = useForm();

//   const createReportMutation = useMutation({
//     mutationFn: async (formData) => {
//       const response = await fetch("http://localhost:5000/api/reports", {
//         method: "POST",
//         body: formData,
//         credentials: "include"
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to submit report");
//       }

//       return await response.json();
//     },
//     onSuccess: async () => {
//       if (user) {
//         await updateUserPoints(user._id, 100);
//       }
//       reset();
//       setFiles([]);
//       setPreviewUrls([]);
//       setLocation(null);
//       setAddress("");
//       setSubmitError("");
//       toast.success("Report submitted successfully");
//       navigate("/dashboard/user", {
//         state: { success: true, message: "Report submitted successfully" }
//       });
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to submit report");
//       setSubmitError(error.message || "Failed to submit report");
//       setIsSubmitting(false);
//     }
//   });

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//     const newPreviewUrls = selectedFiles.map((file) =>
//       URL.createObjectURL(file)
//     );
//     setPreviewUrls(newPreviewUrls);
//   };

//   // Open camera
//  const openCamera = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     streamRef.current = stream;
//     setShowCamera(true); 
//   } catch (err) {
//     toast.error("Unable to access camera: " + err.message);
//   }
// };
// useEffect(() => {
//   if (showCamera && videoRef.current && streamRef.current) {
//     videoRef.current.srcObject = streamRef.current;
//     videoRef.current.play();
//   }
// }, [showCamera]);

// //stop camera
// const stopCamera = () => {
//   if (streamRef.current) {
//     streamRef.current.getTracks().forEach((track) => track.stop()); // stops camera + mic
//     streamRef.current = null;
//   }
//   setShowCamera(false);
// };



//   // Capture image
//   const captureImage = () => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob((blob) => {
//       if (!blob) return;
//       const file = new File([blob], `image-${Date.now()}.png`, {
//         type: "image/png"
//       });
//       setFiles((prev) => [...prev, file]);
//       setPreviewUrls((prev) => [...prev, URL.createObjectURL(file)]);
//       toast.success("Image captured!");
//       stopCamera();
//     });
//   };

//   // Start recording
//   const startRecording = () => {
//     if (!streamRef.current) return;
//     const recorder = new MediaRecorder(streamRef.current);
//     setRecordedChunks([]);
//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
//     };
//     recorder.onstop = () => {
//       const blob = new Blob(recordedChunks, { type: "video/webm" });
//       const file = new File([blob], `video-${Date.now()}.webm`, {
//         type: "video/webm"
//       });
//       setFiles((prev) => [...prev, file]);
//       setPreviewUrls((prev) => [...prev, URL.createObjectURL(file)]);
//       toast.success("Video recorded!");
//       stopCamera();
//     };
//     recorder.start();
//     setMediaRecorder(recorder);
//     setIsRecording(true);
//   };

//   // Stop recording
//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   useEffect(() => {
//     if (useCurrentLocation && navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const latlng = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setLocation(latlng);
//           try {
//             const response = await fetch(
//               `https://api.mapbox.com/geocoding/v5/mapbox.places/${latlng.lng},${latlng.lat}.json?access_token=${accessToken}`
//             );
//             const data = await response.json();
//             setAddress(data?.features?.[0]?.place_name || "Unknown location");
//           } catch (error) {
//             setAddress("Unable to determine address: " + error.message);
//           }
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//           setUseCurrentLocation(false);
//         }
//       );
//     }
//   }, [useCurrentLocation]);

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     setSubmitError("");

//     let latitude = null;
//     let longitude = null;
//     let finalAddress = "";

//     if (useCurrentLocation) {
//       latitude = location?.lat;
//       longitude = location?.lng;
//       finalAddress = address;
//     } else {
//       finalAddress = data.manualAddress;
//       try {
//         const geocodeResponse = await fetch(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             finalAddress
//           )}.json?access_token=${accessToken}`
//         );
//         const geocodeData = await geocodeResponse.json();
//         const coords = geocodeData.features?.[0]?.center;
//         if (!coords) throw new Error("Invalid manual address.");
//         longitude = coords[0];
//         latitude = coords[1];
//       } catch (err) {
//         setSubmitError("Manual address geocoding failed: " + err.message);
//         setIsSubmitting(false);
//         return;
//       }
//     }

//     if (!latitude || !longitude || !finalAddress) {
//       setSubmitError("Please provide a valid location");
//       setIsSubmitting(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", data.title);
//     formData.append("description", data.description);
//     formData.append("incidentType", data.incidentType);
//     formData.append("latitude", latitude);
//     formData.append("longitude", longitude);
//     formData.append("address", finalAddress);
//     files.forEach((file) => formData.append("media", file));

//     createReportMutation.mutate(formData);
//   };

//   useEffect(() => {
//     return () => {
//       previewUrls.forEach((url) => URL.revokeObjectURL(url));
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [previewUrls]);

//   return (
//     <div className="container py-5">
//       <h1 className="text-center mb-4">Report an Incident</h1>
//       {submitError && <div className="alert alert-danger">{submitError}</div>}
//       <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm">
//         <div className="mb-3">
//           <label className="form-label">Incident Title</label>
//           <input
//             type="text"
//             className="form-control"
//             {...register("title", { required: "Title is required" })}
//           />
//           {errors.title && (
//             <div className="text-danger">{errors.title.message}</div>
//           )}
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Incident Type</label>
//           <select
//             className="form-select"
//             {...register("incidentType", { required: "Incident type is required" })}
//           >
//             <option value="">Select incident type</option>
//             <option value="theft">Theft</option>
//             <option value="assault">Assault</option>
//             <option value="burglary">Burglary</option>
//             <option value="vandalism">Vandalism</option>
//             <option value="fraud">Fraud</option>
//             <option value="harassment">Harassment</option>
//             <option value="violent">Violent</option>
//             <option value="traffic offense">Traffic offense</option>
//             <option value="suspicious">Suspicious Activity</option>
//             <option value="other">Other</option>
//           </select>
//           {errors.incidentType && (
//             <div className="text-danger">{errors.incidentType.message}</div>
//           )}
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Description</label>
//           <textarea
//             className="form-control"
//             rows="4"
//             {...register("description", { required: "Description is required" })}
//           ></textarea>
//           {errors.description && (
//             <div className="text-danger">{errors.description.message}</div>
//           )}
//         </div>

//         {/* File Upload */}
//         <div className="mb-3">
//           <label className="form-label">Upload Media (Image/Video)</label>
//           <input
//             type="file"
//             className="form-control"
//             accept="image/*,video/*"
//             multiple
//             onChange={handleFileChange}
//           />
//           <div className="mt-2">
//             {previewUrls.map((url, index) =>
//               url.endsWith(".webm") ? (
//                 <video key={index} src={url} controls width="150" className="me-2 mb-2 rounded" />
//               ) : (
//                 <img
//                   key={index}
//                   src={url}
//                   alt="Preview"
//                   className="img-thumbnail me-2 mb-2"
//                   style={{ maxWidth: "150px" }}
//                 />
//               )
//             )}
//           </div>
//         </div>

//         {/* Camera Section */}
//         <div className="mb-3">
//           <button type="button" className="btn btn-outline-primary w-100 mb-2" onClick={openCamera}>
//             Open Camera
//           </button>
//           {showCamera && (
//             <div className="text-center">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="rounded shadow mb-2"
//                 width="300"
//               />
//               <canvas ref={canvasRef} className="d-none"></canvas>
//               <div className="d-flex justify-content-center gap-2">
//                 <button type="button" className="btn btn-success" onClick={captureImage}>
//                   Capture Image
//                 </button>
//                 {!isRecording ? (
//                   <button type="button" className="btn btn-danger" onClick={startRecording}>
//                     Start Recording
//                   </button>
//                 ) : (
//                   <button type="button" className="btn btn-secondary" onClick={stopRecording}>
//                     Stop Recording
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Location */}
//         <div className="mb-3 form-check form-switch">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             checked={useCurrentLocation}
//             onChange={() => setUseCurrentLocation(!useCurrentLocation)}
//           />
//           <label className="form-check-label">Use Current Location</label>
//         </div>

//         {useCurrentLocation ? (
//           <div className="mb-3">
//             <label className="form-label">Detected Location</label>
//             <p>{address || "Fetching current location..."}</p>
//           </div>
//         ) : (
//           <div className="mb-3">
//             <label className="form-label">Manual Address</label>
//             <input
//               type="text"
//               className="form-control"
//               {...register("manualAddress", {
//                 required: "Manual address is required"
//               })}
//             />
//             {errors.manualAddress && (
//               <div className="text-danger">{errors.manualAddress.message}</div>
//             )}
//           </div>
//         )}

//         <button
//           type="submit"
//           className="btn btn-primary w-100"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Report"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ReportForm;
