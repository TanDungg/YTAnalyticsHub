import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BenchmarkSection from './components/BenchmarkSection';
import VideoExplorer from './components/VideoExplorer';
import VideoAnalyticsModal from './components/VideoAnalyticsModal';
import ConnectChannelModal from './components/ConnectChannelModal';
import { getChannels, getChannelVideos, syncChannelVideos } from './services/api';
import { CheckCircle2, Youtube, PlusCircle } from 'lucide-react';

export default function App() {
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Filters
  const [formatFilter, setFormatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');

  // Status & Toast
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const syncedChannelsRef = useRef(new Set());

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. Tải danh sách kênh từ Backend
  const loadChannels = useCallback(async (selectId = null) => {
    try {
      setIsLoading(true);
      const data = await getChannels();
      setChannels(data);

      if (data.length > 0) {
        if (selectId && data.some(c => c.id === selectId || c.channelId === selectId)) {
          setActiveChannelId(selectId);
        } else if (!activeChannelId || !data.some(c => c.id === activeChannelId || c.channelId === activeChannelId)) {
          setActiveChannelId(data[0].id || data[0].channelId);
        }
      } else {
        setActiveChannelId(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách kênh:", err);
      showToast("Không thể kết nối đến Backend API");
    } finally {
      setIsLoading(false);
    }
  }, [activeChannelId]);

  // 2. Bắt URL Params sau khi Google OAuth chuyển hướng về
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('channel_connected');
    const selectedId = params.get('selected_id');
    const error = params.get('error');

    if (connected) {
      showToast(`🎉 Đã liên kết thành công kênh: ${connected}!`);
      loadChannels(selectedId);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error && error !== 'invalid_grant') {
      showToast(`⚠️ Lỗi liên kết: ${error}`);
      loadChannels();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      loadChannels();
    }
  }, []);

  // 3. Tải danh sách Video khi Kênh hoặc Bộ lọc thay đổi
  const loadVideos = useCallback(async () => {
    if (!activeChannelId) {
      setVideos([]);
      return;
    }

    try {
      const data = await getChannelVideos(activeChannelId, {
        format: formatFilter,
        q: searchQuery,
        sort: sortOption
      });
      setVideos(data);

      // TỰ ĐỘNG KÍCH HOẠT ĐỒNG BỘ 1 LẦN NẾU KÊNH CHƯA CÓ VIDEO (KHÔNG LOOP)
      if (data.length === 0 && !searchQuery && !syncedChannelsRef.current.has(activeChannelId)) {
        syncedChannelsRef.current.add(activeChannelId);
        const currentChannel = channels.find(c => c.id === activeChannelId || c.channelId === activeChannelId);
        if (currentChannel && currentChannel.tokens?.refresh_token !== "imported_public_channel") {
          setIsSyncing(true);
          syncChannelVideos(activeChannelId).then(res => {
            if (res.videos && res.videos.length > 0) {
              setVideos(res.videos);
              loadChannels(activeChannelId);
            }
          }).finally(() => {
            setIsSyncing(false);
          });
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải video:", err);
    }
  }, [activeChannelId, formatFilter, searchQuery, sortOption, channels, loadChannels]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const activeChannel = channels.find(c => c.id === activeChannelId || c.channelId === activeChannelId);

  // Thao tác đồng bộ thủ công khi bấm nút
  const handleSync = async () => {
    if (!activeChannelId) return;
    try {
      setIsSyncing(true);
      showToast("Đang đồng bộ số liệu mới nhất từ YouTube Data API...");
      const res = await syncChannelVideos(activeChannelId);
      setVideos(res.videos || []);
      await loadChannels(activeChannelId);
      showToast(`Đồng bộ thành công ${res.count || 0} video!`);
    } catch (err) {
      showToast("Lỗi khi đồng bộ video");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        channels={channels}
        activeChannelId={activeChannelId}
        onSelectChannel={(id) => {
          setActiveChannelId(id);
          const ch = channels.find(c => c.id === id || c.channelId === id);
          if (ch) showToast(`Đã chuyển sang kênh: ${ch.name}`);
        }}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        showToast={showToast}
      />

      <main className="main-workspace">
        {channels.length === 0 && !isLoading ? (
          /* EMPTY STATE */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <div style={{
              width: 72,
              height: 72,
              background: 'linear-gradient(135deg, #ff0033, #b80024)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(255, 0, 51, 0.4)',
              marginBottom: 24
            }}>
              <Youtube size={38} color="#fff" />
            </div>

            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
              Chưa Có Kênh Nào Được Liên Kết
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.6, marginBottom: 28 }}>
              Bạn có thể <strong>dán link kênh YouTube bất kỳ (siêu tốc, không cần đăng nhập)</strong> hoặc <strong>kết nối qua Google OAuth</strong>.
            </p>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: 'none',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <PlusCircle size={20} />
              <span>Thêm kênh YouTube vào ngay</span>
            </button>
          </div>
        ) : (
          /* DASHBOARD CHÍNH */
          <>
            <Header
              activeChannel={activeChannel}
              onSync={handleSync}
              isSyncing={isSyncing}
            />

            <BenchmarkSection
              benchmarks={activeChannel?.benchmarks}
            />

            <VideoExplorer
              videos={videos}
              benchmark={activeChannel?.benchmarks}
              formatFilter={formatFilter}
              setFormatFilter={setFormatFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              onSelectVideo={setSelectedVideo}
            />
          </>
        )}
      </main>

      {/* POPUP THÊM KÊNH */}
      <ConnectChannelModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onChannelAdded={(newChannel) => {
          loadChannels(newChannel.id);
        }}
        showToast={showToast}
      />

      {/* MODAL SOI CHI TIẾT VIDEO */}
      {selectedVideo && (
        <VideoAnalyticsModal
          video={selectedVideo}
          benchmark={activeChannel?.benchmarks}
          onClose={() => setSelectedVideo(null)}
          showToast={showToast}
        />
      )}

      {toastMsg && (
        <div className="toast">
          <CheckCircle2 className="toast-icon" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
