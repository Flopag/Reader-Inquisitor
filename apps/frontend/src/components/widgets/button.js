import React from 'react';
import "./css/button.css";

class Button extends React.Component {
    render(){
        const { on_click, message, background_color, color } = this.props;
        const on_click_funct = () => {
            if(on_click)
                on_click();
        };
        return  <>
                    <div 
                        className="button" 
                        onClick={on_click_funct}
                        style={{
                            backgroundColor: (background_color) ? background_color : "#ff00d5",
                            color: (color) ? color : "#00ffff",
                        }}
                    >{message}</div>
                </>
    }
}

export default Button;