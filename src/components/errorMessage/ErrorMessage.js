import img from './error.gif';

const ErrorMessage = () => {
  return (
    <img className="error-img" src={img} alt="error" />
  )
};

export default ErrorMessage;