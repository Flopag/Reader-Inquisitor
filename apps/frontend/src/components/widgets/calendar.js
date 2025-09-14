import React from 'react';
import "./css/calendar.css";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        const today = new Date();
        content_map: null
        this.state = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            content_array: props.content,
        };
    }

    date_to_string(date){
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    }

    date_to_ij(date){
        const { year, month } = this.state;
        if(!(date.getMonth()+1 == month && date.getFullYear() == year))
            return (-1, -1);

        const dd = date.getDate();
    
        const first_day = new Date(year, month-1, 1).getDay();

        const j = date.getDay();
        
        const i = Math.floor((dd+first_day)/7);

        return [i, j];
    }

    ij_to_date(i, j){
        const { year, month } = this.state;

        const first_day = new Date(year, month-1, 1).getDay();

        const dd = i*7+j-first_day+1;

        if(dd == 0)
            return null;

        return new Date(year, month-1, dd);
    }

    fill_content_map(){
        const { content_array } = this.state;

        if(!content_array)
            return;

        const new_content_map = {};

        content_array.forEach(element => {
            const key = this.date_to_string(element.date);
            new_content_map[key] = [element.mini, element.page];
        });

        this.content_map = new_content_map;
    }

    get_in_content_map(date){
        if(!this.content_map || !date)
            return null;

        const key = this.date_to_string(date);

        return this.content_map[key]
    }
    
    get_calendar_row_html(i){
        const { month } = this.state;
        const cells = [];
        const today_ij = this.date_to_ij(new Date());
        
        for(let j=0; j < 7; ++j){
            const current_date = this.ij_to_date(i,j)
            const element = this.get_in_content_map(current_date);
            const is_active = (current_date?.getMonth() == month-1);
            cells.push(<div 
                key={j} 
                className={`Calendar-cell-${is_active} today-${j==today_ij[1] && i==today_ij[0]}`} 
                id={`calendar-cell-${j}`}>{(element && is_active) ? element[0] : ""}
            </div>)
        }

        return cells;
    }

    get_calendar_html(year, month){
        if(month < 1 || month > 12)
            return;

        const rows = [];

        for(let i=0; i < 5; ++i){
            rows.push(<div key={i} className='Calendar-row' id={`calendar-row-${i}`}>{
                (i==0) ? this.get_calendar_row_html(i) :
                (i==4) ? this.get_calendar_row_html(i) :
                this.get_calendar_row_html(i)
            }</div>)
        }

        return rows;
    }

    to_previous_month(){
        this.setState((previous_state) => {
            let { year, month } = previous_state; 

            if(month == 1){
                year -= 1;
                month = 12;
            } else 
                month -= 1;
                
            return { year, month };
        });
    }

    to_next_month(){
        this.setState((previous_state) => {
            let { year, month } = previous_state; 

            if(month == 12){
                year += 1;
                month = 1;
            } else 
                month += 1;
                
            return { year, month };
        });
    }

    render(){
        this.fill_content_map();

        const { year, month } = this.state;

        const to_previous_month = () => {
            this.to_previous_month();
        };

        const to_next_month = () => {
            this.to_next_month();
        };

        return  <div id="Calendar">
                    <div className='Calendar-headers'>
                        <div className={`Calendar-label-cell`} onClick={to_previous_month} style={{cursor: "pointer"}}>prev</div>
                        <div id="Calendar-title">{month}/{year}</div>
                        <div className={`Calendar-label-cell`} onClick={to_next_month} style={{cursor: "pointer"}}>Next</div>
                    </div>
                    <div className='Calendar-row'>
                        <div className={`Calendar-label-cell`}>Su</div>
                        <div className={`Calendar-label-cell`}>Mo</div>
                        <div className={`Calendar-label-cell`}>Tu</div>
                        <div className={`Calendar-label-cell`}>We</div>
                        <div className={`Calendar-label-cell`}>Th</div>
                        <div className={`Calendar-label-cell`}>Fr</div>
                        <div className={`Calendar-label-cell`}>Sa</div>
                    </div>
                    {this.get_calendar_html(year, month)}
                </div>
    }
}

export default Calendar;