function App() {

    const [displayTime, setDisplayTime] = React.useState(25 *60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [audioPlaying, setAudipPlaying] = React.useState(false);

    const [breakAudio, setBreakAudio] = React.useState(new Audio("./breakTimer.mp3"));


    const playSound = () => {
        if(!audioPlaying){
            //breakAudio.
        }
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const formatTime = (time) => {
        let mins = Math.floor(time / 60);
        let seconds = time % 60;
        return (
            (mins < 10 ? "0" + mins : mins) + ":" + (seconds < 10 ? "0" + seconds: seconds)
        );
        
    }

    const formatTimeCases = (time) => {
        let mins = Math.floor(time / 60);
        return (mins);
    }

    const changeTime = (amount, type) => {
        if(type == "break"){
            if((breakTime <= 60 && amount < 0) || (breakTime >= (60 * 60) && amount >=0)){
                return;
            }/*else if(breakTime / 60 == 60){
                return;
            }*/
            setBreakTime(prev => prev + amount);
        }else{
            if((sessionTime <= 60 && amount < 0) || (breakTime >= (60 * 60) && amount >=0)){
                return;
            }/*else if(breakTime / 60 == 60){
                return;
            }*/
            setSessionTime(prev => prev + amount);
            if(!timerOn){
                setDisplayTime(sessionTime + amount);
            }
        }
        console.log(breakTime + " " + amount);
    }
    
    const controlTime = () => {
        let second = 950;
        let date = (new Date()).getTime();
        let nextDate = (new Date()).getTime() + second;
        let onBreakVariable = onBreak;

        if(!timerOn){
            let interval = setInterval(() => {
                date = (new Date()).getTime();
                if(date > nextDate){
                    setDisplayTime((prev) => {
                        if(prev <= 0 && !onBreakVariable){
                            playSound();
                            onBreakVariable=true;
                            setOnBreak(true);
                            return breakTime;
                        }else if(prev <= 0 && onBreakVariable){
                            playSound();
                            onBreakVariable=false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                     return prev -1; 
                    })
                    
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval)
        }

        if(timerOn){
            clearInterval(localStorage.getItem("interval-id"));
        }

        setTimerOn(!timerOn);
    }

    const resetTime = () => {
        setDisplayTime(25 * 60);
        setBreakTime(5 * 60);
        setSessionTime(25 * 60);
        setOnBreak(false);
        setAudipPlaying(false);
        controlTime();
    }

    return(
        <div className="center-align">
            <h1>25 + 5 Clock</h1>
            <div className="dual-container">
                <Length title={"Break Length"} changeTime={changeTime} type={"break"} time={breakTime} formatTimeCases={formatTimeCases} />
                <Length title={"Session Length"} id="session-label" changeTime={changeTime} type={"session"} time={sessionTime} formatTimeCases={formatTimeCases} />
            </div>
            <h3 id = "timer-label">{onBreak ? "Break" : "Session"}</h3>
            <h1 id="time-left">{formatTime(displayTime)}</h1>
            <button id="start_stop"className="btn-large deep-purple lighten-2" onClick={controlTime}>
                {timerOn ? (
                    <i className="material-icons">pause_circle_filled</i>
                ) : (
                    <i className="material-icons">play_circle_filled</i>
                )}
            </button>
            <button id="reset" className="btn-large deep-purple lighten-2" onClick={resetTime}>
                <i className="material-icons">autorenew</i>
            </button>
        </div>
    );
}

function Length({ title, changeTime, type, time, formatTimeCases }){
    return(
        <div>
            <h3 id={title == "Break Length" ? `${type}-label` : `${type}-label`}>{title}</h3>
            <div className="time-sets">
                <button className="btn-small deep-purple lighten-2" id={type == "break" ? `${type}-decrement` : `${type}-decrement`} onClick={()=>changeTime(-60, type)}>
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h3 id={type == "break" ? `${type}-length` : `${type}-length`}>{formatTimeCases(time)}</h3>
                <button className="btn-small deep-purple lighten-2" id={type == "break" ? `${type}-increment` : `${type}-increment`}onClick={()=>changeTime(60, type)}>
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));