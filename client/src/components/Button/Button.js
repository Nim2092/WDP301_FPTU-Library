import "./Button.scss";
import { useNavigate } from "react-router-dom";

const Button = ({ text, link, clName, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); 
    } else {
      navigate(link);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clName ? "btn-orange button-gradient" : "btn-orange"}
    >
      {text}
    </button>
  );
};

export default Button;
