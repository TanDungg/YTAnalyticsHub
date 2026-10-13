import React, { useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";

export default function Header({ activeChannel, onSync, isSyncing }) {
  const [lastSync, setLastSync] = useState(
    new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const handleRefresh = async () => {
    await onSync();
    setLastSync(
      new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  if (!activeChannel) return null;

  return (
    <header className="top-nav">
      <div className="active-channel-header">
        <div className="avatar-ring">
          <img
            src={activeChannel.avatar}
            alt={activeChannel.name}
            className="header-avatar"
          />
        </div>
        <div>
          <div className="title-with-badge">
            <h1>{activeChannel.name}</h1>
            <span className="channel-handle">{activeChannel.handle}</span>
            <span className="status-pill">
              <CheckCircle2 size={13} /> Đang hoạt động
            </span>
          </div>
          <p className="channel-desc">{activeChannel.topic}</p>
        </div>
      </div>

      <div className="top-nav-actions">
        <div className="sync-info">
          <span>Đồng bộ: {lastSync}</span>
        </div>
        <button
          className="btn-refresh"
          onClick={handleRefresh}
          disabled={isSyncing}
        >
          <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
          <span>{isSyncing ? "Đang đồng bộ..." : "Đồng bộ lại"}</span>
        </button>
      </div>
    </header>
  );
}
