import ClipLoader from "react-spinners/ClipLoader";
import "./Loader.css";

function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <ClipLoader
        size={50}
        color="#ff4d4d"
      />

      <p>{message}</p>
    </div>
  );
}

export default Loader;