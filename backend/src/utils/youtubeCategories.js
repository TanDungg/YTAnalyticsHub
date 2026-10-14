export const YOUTUBE_CATEGORIES = {
  "1": "Phim & Hoạt hình",
  "2": "Ô tô & Xe cộ",
  "10": "Âm nhạc",
  "15": "Thú cưng & Động vật",
  "17": "Thể thao",
  "18": "Phim ngắn",
  "19": "Du lịch & Sự kiện",
  "20": "Trò chơi",
  "21": "Videoblog",
  "22": "Mọi người & Blog",
  "23": "Hài kịch",
  "24": "Giải trí",
  "25": "Tin tức & Chính trị",
  "26": "Hướng dẫn & Phong cách",
  "27": "Giáo dục",
  "28": "Khoa học & Công nghệ",
  "29": "Hoạt động phi lợi nhuận",
  "30": "Phim",
  "31": "Anime / Hoạt hình",
  "32": "Hành động / Phiêu lưu",
  "33": "Cổ điển",
  "34": "Hài kịch",
  "35": "Tài liệu",
  "36": "Chính kịch",
  "37": "Gia đình",
  "38": "Nước ngoài",
  "39": "Kinh dị",
  "40": "Khoa học viễn tưởng",
  "41": "Hồi hộp",
  "42": "Shorts",
  "43": "Chương trình",
  "44": "Đoạn giới thiệu"
};

export function getCategoryName(categoryId) {
  if (!categoryId) return "Chưa phân loại";
  return YOUTUBE_CATEGORIES[String(categoryId)] || "Chưa phân loại";
}
