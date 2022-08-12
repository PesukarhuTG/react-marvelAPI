import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
  state = {
    error: false
  }

  componentDidCatch(err, info) {
    console.log(err, info);
    this.setState({
      error: true
    })
  }

  render() {
    //если компонент отвалилсяя, отрендерим запасной вариант
    if(this.state.error) {
      return <ErrorMessage />
    }

    return this.props.children;
  }

}

export default ErrorBoundary;