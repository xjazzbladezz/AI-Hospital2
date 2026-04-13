import React, { useState, useEffect } from "react";
import "./App.css";
import jsPDF from "jspdf";

function App() {

  const [view, setView] = useState("home");
  const [activeTest, setActiveTest] = useState("Burnout");

  const [form, setForm] = useState({
    SLEEP_in_hrs: 6,
    STUDY_in_hrs: 5,
    SCREEN_in_hrs: 4,
    EXERCISE_in_hrs: 1,
    SOCIAL_MEDIA_in_hrs: 2,
    ASSIGNMENTS_in_count: 3,
    MOOD_RATING_out_of_10: 5
  });

  const [behaviorForm, setBehaviorForm] = useState({
    SOCIAL_INTERACTION_in_hrs: 5,
    DECISION_MAKING_in_mins: 5,
    RISK_TAKING_out_of_10: 5,
    CONSISTENCY_in_hrs: 5,
    IMPULSIVENESS_RATING_out_of_10: 5,
    PLANNING_RATING_out_of_10: 5,
    STRESS_RESISTANCE_out_of_10: 5
  });

  const [focusForm, setFocusForm] = useState({
    TYPING_SPEED_in_wpm: 50,
    ERROR_RATE_in_percentage: 5,
    TASK_SWITCHING_in_mins: 5,
    REACTION_TIME_in_ms: 60,
    DISTACTION_LEVEL_in_5hrs: 5,
    FOCUS_in_mins: 200
  });

  const [reports, setReports] = useState([]);
  const [displayScore, setDisplayScore] = useState(0);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  const [latestBurnout, setLatestBurnout] = useState(null);
  const [latestBehaviour, setLatestBehaviour] = useState(null);
  const [latestFocus, setLatestFocus] = useState(null);

  const [typedTitle, setTypedTitle] = useState("");
  const [typedSub, setTypedSub] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(saved);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  useEffect(() => {
  const title = "S•A•B•A•S SEWA KENDRA - आपकी मानसिक समस्याओं का इलाज ";
  const sub = "Smart Lifestyle Analyzer";

  let i = 0;

  const titleInterval = setInterval(() => {
    setTypedTitle(title.slice(0, i));
    i++;

    if (i > title.length) {
      clearInterval(titleInterval);

      let j = 0;
      const subInterval = setInterval(() => {
        setTypedSub(sub.slice(0, j));
        j++;

        if (j > sub.length) clearInterval(subInterval);
      }, 40);
    }

  }, 80);

  return () => clearInterval(titleInterval);
}, []);

  const burnoutRaw =
    (form.SLEEP_in_hrs * 2 +
      form.EXERCISE_in_hrs * 2 +
      form.MOOD_RATING_out_of_10 * 2 +
      form.STUDY_in_hrs +
      form.SOCIAL_MEDIA_in_hrs -
      form.SCREEN_in_hrs -
      form.ASSIGNMENTS_in_count) * 5;

  const behaviorRaw =
  (behaviorForm.CONSISTENCY_in_hrs * 2 +
   behaviorForm.PLANNING_RATING_out_of_10 * 2 +
   behaviorForm.DECISION_MAKING_in_mins -
   behaviorForm.IMPULSIVENESS_RATING_out_of_10 -
   behaviorForm.RISK_TAKING_out_of_10 +
   behaviorForm.SOCIAL_INTERACTION_in_hrs -
   behaviorForm.STRESS_RESISTANCE_out_of_10) * 5;

const focusRaw =
  (focusForm.FOCUS_in_mins +
   focusForm.TYPING_SPEED_in_wpm / 2 -
   focusForm.ERROR_RATE_in_percentage * 2 -
   focusForm.DISTACTION_LEVEL_in_5hrs * 2 -
   focusForm.TASK_SWITCHING_in_mins +
   (300 - focusForm.REACTION_TIME_in_ms)/10) * 2;

  const burnoutScore = Math.max(0, Math.min(100, burnoutRaw));
  const behaviourScore = Math.max(0, Math.min(100, behaviorRaw));
  const focusScore = Math.max(0, Math.min(100, focusRaw));

  const finalScore =
    activeTest==="Burnout"
      ? burnoutScore
      : activeTest==="Behaviour"
      ? behaviourScore
      : focusScore;

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= finalScore) {
        start = finalScore;
        clearInterval(interval);
      }
      setDisplayScore(start);
    }, 15);
  }, [finalScore]);

  const handleChange = (e) => {
    const value = Math.max(0, Math.min(10, Number(e.target.value)));
    setForm({ ...form, [e.target.name]: value });
  };

  const handleNumberChange = (key, value) => {
    const v = Math.max(0, Math.min(10, Number(value)));
    setForm({ ...form, [key]: v });
  };

  const handleBehaviorChange = (key, value) => {
    const v = Math.max(0, Math.min(10, Number(value)));
    setBehaviorForm({ ...behaviorForm, [key]: v });
  };

  const handleFocusChange = (key, value) => {
    const v = Math.max(0, Math.min(100, Number(value)));
    setFocusForm({ ...focusForm, [key]: v });
  };

  let color = "#ff3b30";
  if (finalScore > 70) color = "#34c759";
  else if (finalScore > 40) color = "#ffcc00";

  let burnout = burnoutScore > 70 ? "High Burnout Risk" : "Normal";
  let behaviour = behaviourScore > 70 ? "Good Behaviour" : "Average Behaviour";
  let focus = focusScore > 70 ? "High Focus" : "Moderate Focus";

  const aiSuggestion = () => {
    if (burnout === "High Burnout Risk") return "Improve sleep and reduce screen time.";
    if (behaviour === "Average Behaviour") return "Improve consistency and planning.";
    if (focus === "Moderate Focus") return "Reduce distractions.";
    return "You are doing well. Keep consistency.";
  };

  const saveReport = (type) => {

    if(type==="Burnout") setLatestBurnout({score: burnoutScore, level: burnout});
    if(type==="Behaviour") setLatestBehaviour({score: behaviourScore, level: behaviour});
    if(type==="Focus") setLatestFocus({score: focusScore, level: focus});

    const report = {
      type,
      score: finalScore,
      burnout,
      behaviour,
      focus,
      suggestion: aiSuggestion(),
      date: new Date().toLocaleString()
    };

    const updated = [report, ...reports];
    setReports(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
    alert(`${type} Report Saved`);
  };

  const saveFinalReport = () => {
    const tests = [latestBurnout, latestBehaviour, latestFocus].filter(x=>x);
    const avg = tests.length ? Math.round(tests.reduce((a,b)=>a+b.score,0)/tests.length) : 0;

    const report = {
      type: "Final",
      score: avg,
      burnout: latestBurnout?.level || "Not Taken",
      behaviour: latestBehaviour?.level || "Not Taken",
      focus: latestFocus?.level || "Not Taken",
      suggestion: "Combined AI Health Analysis",
      date: new Date().toLocaleString()
    };

    const updated = [report, ...reports];
    setReports(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
    alert("Final Report Saved");
  };

  const deleteReport = (i) => {
    const updated = reports.filter((_, index) => index !== i);
    setReports(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
  };

  const printReport = async (r) => {

  try {
    await fetch("http://localhost:5000/save-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(r)
    });
  } catch {
    console.log("Backend not running");
  }

  const doc = new jsPDF();

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AI Health Assessment Report", 20, y);

  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${r.date}`, 20, y);

  y += 15;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Assessment Result", 20, y);

  y += 8;

  doc.setDrawColor(150);
  doc.line(20, y, 190, y);

  y += 10;

  const addLine = (label, value) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);

    doc.setFont("helvetica", "normal");
    doc.text(String(value), 100, y);

    y += 10;
  };

  addLine("Burnout Level", r.burnout);
  addLine("Burnout Score", `${r.score}/100`);
  addLine("Behaviour", r.behaviour);
  addLine("Focus", r.focus);

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Doctor's Recommendation:", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.text(r.suggestion, 20, y, { maxWidth: 170 });

  doc.save("AI_Health_Report.pdf");
};

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-circle"></div>
        <h2>Analyzing Health...</h2>
      </div>
    );
  }

  return (
    <div className={`container ${dark ? "dark" : ""}`}>

      <div className="sidebar">
        <div className={`sidebar-block ${view==="home"?"active":""}`} onClick={()=>setView("home")}>Home</div>
        <div className={`sidebar-block ${view==="dashboard"?"active":""}`} onClick={()=>setView("dashboard")}>Dashboard</div>
        <div className={`sidebar-block ${view==="reports"?"active":""}`} onClick={()=>setView("reports")}>Medical Reports</div>
        <button className="dark-toggle" onClick={()=>setDark(!dark)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="content">

        {view==="home" && (
  <div className="home">

    <div className="home-top center">
  <h1 className="typing">{typedTitle}</h1>
  <p className="typing-sub">{typedSub}</p>
  <div className="heart"></div>
</div>

    <div className="home-features">

      <div className="feature-card">
        <h3>Burnout Analysis</h3>
        <p>Track mental fatigue and lifestyle balance with AI scoring.</p>
      </div>

      <div className="feature-card">
        <h3>Behaviour Insights</h3>
        <p>Understand habits, discipline and decision patterns.</p>
      </div>

      <div className="feature-card">
        <h3>Focus Tracking</h3>
        <p>Measure concentration, reaction and productivity levels.</p>
      </div>

    </div>

    <div className="home-stats">

      <div>
        <h2>3</h2>
        <p>AI Tests</p>
      </div>

      <div>
        <h2>100%</h2>
        <p>Personalized Reports</p>
      </div>

      <div>
        <h2>Real-Time</h2>
        <p>Analysis</p>
      </div>

    </div>

    <button className="save-btn">
      ꜱᴜʀʏᴀɴꜱʜ ᴄʜᴀɴᴅʀᴀ • ᴀᴀʙʜᴀꜱ ʟᴀʟ • ʙʜᴀᴠɪꜱʜʏᴀ ɢᴀᴜʀ • ᴀʙʜɪɴᴀᴠ ᴘʀᴀᴛᴀᴘ ꜱɪɴɢʜ • ꜱᴜᴊᴀɴ ᴋʜᴀɴ
    </button>

  </div>
)}

        {view==="dashboard" && (
          <div className="dashboard">

            <div className={`test-card ${activeTest==="Burnout"?"active":"shrink"}`} onClick={()=>setActiveTest("Burnout")}>
              <h2>Burnout Test</h2>
              {activeTest==="Burnout" && (
                <div className="burnout-layout">
                  <div className="slider-section">
                    {Object.keys(form).map((key)=>(
                      <div key={key} className="input-group">
                        <div className="label-row">
                          <label>{key}</label>
                          <input type="number" value={form[key]} className="number-input" onChange={(e)=>handleNumberChange(key,e.target.value)} />
                        </div>
                        <input type="range" name={key} value={form[key]} min="0" max="10" onChange={handleChange} className="slider" />
                      </div>
                    ))}
                  </div>

                  <div className="result-section">
                    <div
  className="ring-fill glow-ring"
  style={{
    background: `conic-gradient(${color} ${finalScore}%, #e5e5ea ${finalScore}%)`,
    transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)"
  }}
>
                      <div className="ring-inner"><span className="score-text">{displayScore}</span></div>
                    </div>

                    <div className="score-bar">
                      <div className="score-fill" style={{width:`${finalScore}%`, background:color}}></div>
                    </div>

                    <p>{burnout}</p>
                    <div className="ai-box"><p>{aiSuggestion()}</p></div>
                    <button className="save-btn" onClick={()=>saveReport("Burnout")}>Save Burnout Report</button>
                    <button className="save-btn" onClick={saveFinalReport}>Save Final Report</button>
                  </div>
                </div>
              )}
            </div>

            <div className={`test-card ${activeTest==="Behaviour"?"active":"shrink"}`} onClick={()=>setActiveTest("Behaviour")}>
              <h2>Behaviour Test</h2>
              {activeTest==="Behaviour" && (
                <div className="burnout-layout">
                  <div className="slider-section">
                    {Object.keys(behaviorForm).map((key)=>(
                      <div key={key} className="input-group">
                        <div className="label-row">
                          <label>{key}</label>
                          <input type="number" value={behaviorForm[key]} className="number-input" onChange={(e)=>handleBehaviorChange(key,e.target.value)} />
                        </div>
                        <input type="range" value={behaviorForm[key]} min="0" max="10" onChange={(e)=>handleBehaviorChange(key,e.target.value)} className="slider" />
                      </div>
                    ))}
                  </div>

                  <div className="result-section">
                    <div
  className="ring-fill glow-ring"
  style={{
    background: `conic-gradient(${color} ${finalScore}%, #e5e5ea ${finalScore}%)`,
    transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)"
  }}
>
                      <div className="ring-inner"><span className="score-text">{displayScore}</span></div>
                    </div>

                    <div className="score-bar">
                      <div className="score-fill" style={{width:`${finalScore}%`, background:color}}></div>
                    </div>

                    <p>{behaviour}</p>
                    <div className="ai-box"><p>{aiSuggestion()}</p></div>
                    <button className="save-btn" onClick={()=>saveReport("Behaviour")}>Save Behaviour Report</button>
                    <button className="save-btn" onClick={saveFinalReport}>Save Final Report</button>
                  </div>
                </div>
              )}
            </div>

            <div className={`test-card ${activeTest==="Focus"?"active":"shrink"}`} onClick={()=>setActiveTest("Focus")}>
              <h2>Focus Test</h2>
              {activeTest==="Focus" && (
                <div className="burnout-layout">
                  <div className="slider-section">
                    {Object.keys(focusForm).map((key)=>(
                      <div key={key} className="input-group">
                        <div className="label-row">
                          <label>{key}</label>
                          <input type="number" value={focusForm[key]} className="number-input" onChange={(e)=>handleFocusChange(key,e.target.value)} />
                        </div>
                        <input type="range" value={focusForm[key]} min="0" max="100" onChange={(e)=>handleFocusChange(key,e.target.value)} className="slider" />
                      </div>
                    ))}
                  </div>

                  <div className="result-section">
                    <div
  className="ring-fill glow-ring"
  style={{
    background: `conic-gradient(${color} ${finalScore}%, #e5e5ea ${finalScore}%)`,
    transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)"
  }}
>
                      <div className="ring-inner"><span className="score-text">{displayScore}</span></div>
                    </div>

                    <div className="score-bar">
                      <div className="score-fill" style={{width:`${finalScore}%`, background:color}}></div>
                    </div>

                    <p>{focus}</p>
                    <div className="ai-box"><p>{aiSuggestion()}</p></div>
                    <button className="save-btn" onClick={()=>saveReport("Focus")}>Save Focus Report</button>
                    <button className="save-btn" onClick={saveFinalReport}>Save Final Report</button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {view==="reports" && (
          <>
            <h1>Medical Reports</h1>
            {reports.map((r,i)=>(
              <div key={i} className="report-card">
                <p><b>Type:</b> {r.type}</p>
                <p><b>Score:</b> {r.score}</p>
                <p><b>Burnout:</b> {r.burnout}</p>
                <p><b>Behaviour:</b> {r.behaviour}</p>
                <p><b>Focus:</b> {r.focus}</p>
                <p><b>AI:</b> {r.suggestion}</p>
                <button className="save-btn" onClick={()=>printReport(r)}>Print Report</button>
                <button className="delete-btn" onClick={()=>deleteReport(i)}>Delete</button>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

export default App;