import React from "react";

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter';

interface DashboardPageButtonsProps {
  onViewChange: (view: CurrentView) => void;
  hasWeightInput?: boolean;
}

const DashboardPageButtons: React.FC<DashboardPageButtonsProps> = ({ onViewChange, hasWeightInput }) => {
  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
      gap: "20px",
      marginBottom: "30px"
    }}>
      <button
        style={{
          padding: "15px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
        onClick={() => {
          // プロフィール変更の処理
          console.log("プロフィール変更がクリックされました");
          onViewChange('profile');
        }}
      >
        プロフィール変更
      </button>
      
      <button
        style={{
          padding: "15px 20px",
          fontSize: "16px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2196F3"}
        onClick={() => {
          // 運動を記録の処理
          console.log("運動を記録がクリックされました");
          onViewChange('exercise');
        }}
      >
        {hasWeightInput ? (() => {
          const icons = [
            "💪", "🏃", "🚴", "🏊", "⚽", "🏀", "🎾", "🏓", "🏸", "🥊",
            "🤸", "🧘", "🤾", "🏋️", "🤺", "🏇", "⛷️", "🏂", "🤸‍♀️", "🧗"
          ];
          const icon = icons[Math.floor(Math.random() * icons.length)];
          return `運動記録済${icon}`;
        })() : "運動を記録"}
      </button>
      
      <button
        style={{
          padding: "15px 20px",
          fontSize: "16px",
          backgroundColor: "#FF9800",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F57C00"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#FF9800"}
        onClick={() => {
          // 体重を記録の処理
          console.log("体重を管理がクリックされました");
          onViewChange('weight');
        }}
      >
        体重を管理
      </button>
      
      <button
        style={{
          padding: "15px 20px",
          fontSize: "16px",
          backgroundColor: "#9C27B0",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#7B1FA2"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#9C27B0"}
        onClick={() => {
          // 食事を記録の処理
          console.log("食事を記録がクリックされました");
          onViewChange('FoodLog');
        }}
      >
        食事を記録
      </button>
      
      <button
        style={{
          padding: "15px 20px",
          fontSize: "16px",
          backgroundColor: "#607D8B",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#455A64"}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#607D8B"}
        onClick={() => {
          // dieterの処理
          console.log("dieterがクリックされました");
          onViewChange('dieter');
        }}
      >
        dieter
      </button>
    </div>
  );
};

export default DashboardPageButtons;
