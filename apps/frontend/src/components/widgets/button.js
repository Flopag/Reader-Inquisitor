import React from 'react';
import "./css/button.css";

class Button extends React.Component {
    render(){
        const { on_click, message } = this.props;
        const on_click_funct = () => {
            if(on_click)
                on_click();
        };
        return  <>
                    <div className="button" onClick={on_click_funct}>{message}</div>
                </>
    }
}

export default Button;