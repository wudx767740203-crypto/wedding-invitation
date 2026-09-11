/**
 * ======================================================================
 * 「吴德星 & 李婵」专属婚礼电子请帖 - 全局配置文件 (config/wedding.js)
 * 风格：极简高定 (Minimalist Modern) · 欢快温馨配乐 · 浪漫甜蜜画报
 * ======================================================================
 */

const LATITUDE = 22.990936;   // 桂平市罗播乡六凤村精准纬度 (GCJ-02 高德/腾讯/Apple)
const LONGITUDE = 110.093075; // 桂平市罗播乡六凤村精准经度 (GCJ-02 高德/腾讯/Apple)
const BAIDU_LAT = 22.996625;  // 百度地图专属纬度 (BD-09)
const BAIDU_LNG = 110.099629; // 百度地图专属经度 (BD-09)
const BAIDU_ROUTE_URL = "https://map.baidu.com/?newmap=1&s=nav%26c%3D1%26sn%3D1%2524%2524%2524%2524%2524%2524%25E6%2588%2591%25E7%259A%2584%25E4%25BD%258D%25E7%25BD%25AE%2524%25240%2524%2524%2524%2524%26en%3D1%2524%2524%2524%252412256368%252C2614767%2524%2524%25E5%2585%25AD%25E5%2587%25A4%25E6%259D%2591%2524%25240%2524%2524%2524%2524%26sc%3D0%26ec%3D1&sharecallbackflag=carRoute";

const wedding = {
  // ==================== 1. 新人信息 ====================
  groom: "吴德星",
  bride: "李婵",
  groomPinyin: "DE XING",
  bridePinyin: "CHAN",
  groomPhone: "13800000000",
  bridePhone: "13900000000",

  // ==================== 2. 婚礼时间 (农历八月十八 · 2026年9月28日) ====================
  date: "2026-09-28",
  time: "11:58",
  lunarDate: "农历八月十八 · 星期一",

  // ==================== 3. 婚礼地点与导航 ====================
  // 男方喜宴地址
  location: "桂平市罗播乡六凤村",
  address: "广西壮族自治区贵港市桂平市罗播乡六凤村",
  hotel: "婚礼家宴现场（现场设有喜棚与路标指引）",
  parking: "村里的篮球场（免费规范停车，现场有老表热情指引）",
  latitude: LATITUDE,
  longitude: LONGITUDE,
  baiduLatitude: BAIDU_LAT,
  baiduLongitude: BAIDU_LNG,
  baiduRouteUrl: BAIDU_ROUTE_URL,

  // 女方地址 (罗播乡叹自由酒店)
  brideLocation: "广西桂平罗播乡叹自由酒店",
  brideAddress: "广西壮族自治区贵港市桂平市罗播乡S206省道叹自由酒店",
  brideHotel: "叹自由酒店（桂平罗播店）",
  brideParking: "酒店门前及专用停车场均可免费规范停车",
  brideLatitude: 23.0250,
  brideLongitude: 110.0765,

  // ==================== 4. 欢快甜美婚礼配乐库 (默认: 范玮琪《最重要的决定》) ====================
  music: {
    title: "最重要的决定",
    artist: "范玮琪",
    badge: "婚礼经典 · 官方高清原声",
    quote: "你是我最重要的决定，我愿意每天在你身边苏醒... 因为幸福没有捷径，只有经营。",
    src: "assets/music/zuizhongyaodejueding.m4a",
    startTime: 0,
    loop: true
  },

  currentMusicIndex: 0,
  musicPlaylist: [
  {
    "id": "zuizhongyaodejueding",
    "title": "最重要的决定",
    "artist": "范玮琪",
    "badge": "婚礼殿堂经典 · 官方高清原声",
    "quote": "你是我最重要的决定，我愿意每天在你身边苏醒... 因为幸福没有捷径，只有经营。",
    "src": "assets/music/zuizhongyaodejueding.m4a",
    "startTime": 0
  },
  {
    "id": "siben_yueqiu",
    "title": "私奔到月球 (人声起唱版)",
    "artist": "五月天 & 陈绮贞",
    "badge": "去除前奏 · 人声直接开唱",
    "quote": "其实你是个心狠又手辣的小偷，一二三 牵着手，我们私奔到月球...",
    "src": "assets/music/sibendayueqiu.m4a",
    "startTime": 6.3
  },
  {
    "id": "tiantiande",
    "title": "甜甜的",
    "artist": "周杰伦",
    "badge": "经典高甜 · 官方高清原声",
    "quote": "我轻轻的尝一口 你说的爱我，还在回味你给过的温柔，我喜欢的样子你都有...",
    "src": "assets/music/tiantiande.m4a",
    "startTime": 0
  },
  {
    "id": "wojiehunle",
    "title": "我结婚了",
    "artist": "钟嘉欣",
    "badge": "幸福新娘曲 · 官方高清原声",
    "quote": "这一生 只要可以共你走，无论风雨或晴天，我也愿一生牵你手...",
    "src": "assets/music/wojiehunle.m4a",
    "startTime": 0
  },
  {
    "id": "crush_beautiful",
    "title": "Beautiful (《鬼怪》经典OST)",
    "artist": "Crush",
    "badge": "韩剧顶流OST · 极致深情",
    "quote": "It's a beautiful life, 난 너의 곁에 있을게, 只要在你身旁，每刻都如此耀眼...",
    "src": "assets/music/crush_beautiful.m4a",
    "startTime": 0
  },
  {
    "id": "feixing_custom",
    "title": "爱的飞行日记 (官方原声版)",
    "artist": "周杰伦 & 杨瑞代",
    "badge": "经典欢快原声 · 甜蜜起飞",
    "quote": "赤道的边境万里无云天很清，我用脑波在传递，爱的飞行日记...",
    "src": "assets/music/videoplayback.m4a",
    "startTime": 0
  },
  {
    "id": "marry_me",
    "title": "今天你要嫁给我",
    "artist": "陶喆 & 蔡依林",
    "badge": "欢快浪漫 · 经典婚礼对唱",
    "quote": "春暖的花开带走冬天的感伤，微风吹来浪漫的气息，今天你要嫁给我...",
    "src": "assets/music/marry_me.mp3"
  },
  {
    "id": "gaobai",
    "title": "告白气球",
    "artist": "周杰伦",
    "badge": "轻快甜美 · 满心欢喜心动旋律",
    "quote": "亲爱的 爱上你 从那天起，甜蜜的很轻易，你的眼睛在说我愿意...",
    "src": "assets/music/gaobai.mp3"
  },
  {
    "id": "silver_scrapes",
    "title": "Silver Scrapes (英雄联盟BO5战歌)",
    "artist": "Danny McCarthy / 英雄联盟",
    "badge": "热血电竞 · 英雄联盟BO5决胜神曲",
    "quote": "战歌起！BO5决胜局神曲，燃爆全场，属于新郎与召唤师的永恒荣耀！",
    "src": "assets/music/silver_scrapes.mp3",
    "startTime": 0
  },
  {
    "id": "champions_league",
    "title": "UEFA Champions League Anthem (欧冠决赛主题曲)",
    "artist": "Tony Britten / 皇家爱乐乐团",
    "badge": "殿堂经典 · 欧洲冠军联赛决赛主题曲",
    "quote": "THE CHAAAAAAMPIONS! 属于冠军殿堂的荣耀赞歌，执手封冠，走向巅峰！",
    "src": "assets/music/champions_league.mp3",
    "startTime": 0
  },
  {
    "id": "feixing",
    "title": "爱的飞行日记",
    "artist": "周杰伦 & 杨瑞代",
    "badge": "经典欢快 · 甜蜜起飞",
    "quote": "赤道的边境万里无云天很清，我用脑波在传递，爱的飞行日记...",
    "src": "assets/music/feixing.mp3",
    "startTime": 0
  },
  {
    "id": "nanfang",
    "title": "南方姑娘",
    "artist": "赵雷",
    "badge": "民谣温柔 · 南方姑娘浅笑安然",
    "quote": "南方姑娘，你是否习惯北方的秋凉...",
    "src": "assets/music/nanfang.mp3",
    "startTime": 0
  },
  {
    "id": "zhifou",
    "title": "知否知否",
    "artist": "胡夏 & 郁可唯",
    "badge": "古风深情 · 一朝花开傍柳",
    "quote": "一朝花开傍柳，寻香误觅亭侯...",
    "src": "assets/music/zhifou.mp3",
    "startTime": 0
  },
  {
    "id": "yiruma",
    "title": "Yiruma 钢琴曲",
    "artist": "Yiruma",
    "badge": "治愈钢琴 · 温柔流淌的旋律",
    "quote": "琴键起落间，是最温柔的告白。",
    "src": "assets/music/yiruma.mp3",
    "startTime": 0
  },
  {
    "id": "paul_kim",
    "title": "Paul Kim 抒情曲",
    "artist": "Paul Kim",
    "badge": "韩式抒情 · 温柔声线",
    "quote": "温柔的嗓音，唱给最珍贵的你。",
    "src": "assets/music/paul_kim.mp3",
    "startTime": 0
  },
  {
    "id": "valentine",
    "title": "Valentine",
    "artist": "Valentine",
    "badge": "浪漫情人节 · 甜蜜旋律",
    "quote": "愿每一天，都是情人节。",
    "src": "assets/music/valentine.mp3",
    "startTime": 0
  },
  {
    "id": "gushi",
    "title": "我们的故事",
    "artist": "婚礼精选",
    "badge": "温馨叙事 · 属于我们的篇章",
    "quote": "我们的故事，从心动那刻开始书写。",
    "src": "assets/music/gushi.mp3",
    "startTime": 0
  },
  {
    "id": "jianggushixiechengwomen",
    "title": "将故事写成我们",
    "artist": "林俊杰",
    "badge": "婚礼深情 · 过了门永远是一家人",
    "quote": "这故事开始一个人，我认真写成了我们... 进了门开了灯一家人，盼来生依然是一家人。",
    "src": "assets/music/jianggushixiechengwomen.m4a",
    "startTime": 0
  },
  {
    "id": "wedding_march",
    "title": "Wedding 婚礼乐曲",
    "artist": "婚礼精选",
    "badge": "神圣庄严 · 婚礼进行曲",
    "quote": "钟声响起，走向属于我们的幸福。",
    "src": "assets/music/wedding.mp3",
    "startTime": 0
  },
  {
    "id": "custom_bgm",
    "title": "婚礼专属背景音乐",
    "artist": "婚礼精选",
    "badge": "专属定制 · 婚礼现场原声",
    "quote": "属于我们婚礼现场的专属旋律。",
    "src": "assets/music/custom_bgm.mp3",
    "startTime": 0
  }
],

  // ==================== 5. 婚纱摄影大片精选配置 ====================
  photos: {
    cover: "assets/images/cover.jpg",
    spotlight1: "assets/images/0ada7fda938ddc1f853cb30de08d24ee.jpg",
    countdownBg: "assets/images/715fc9e5feab11f78808e49372decfc6.jpg",
    endingBg: "assets/images/16930b6cf9719d43c1bccd12ec011cbb.jpg"
  },

  gallery: [
    { src: "assets/images/2eccefa56cba976f765561e613d951ce.jpg", caption: "华裳囍韵 · 执手偕老" },
    { src: "assets/images/532fb4ffa84e5892ab3f4ae43e117932.jpg", caption: "指尖比心 · 眉眼皆欢" },
    { src: "assets/images/ea04e976bade7397ec503112983280eb.png", caption: "新郎 · 整理领结盛装赴约" },
    { src: "assets/images/7ebe2b5d3c02f93abf9efc605474f2cb.jpg", caption: "新娘 · 巧笑嫣然轻捂笑颜" },
    { src: "assets/images/new_photo_2133.png", caption: "并肩偕行 · 岁月静好" },
    { src: "assets/images/375a7b55048e3de758e1087786fe4921.jpg", caption: "华裳如雪 · 盛装之诺" },
    { src: "assets/images/16ec3c0b9794f04df87bd1e7148de552.jpg", caption: "手捧繁花 · 回眸温润" },
    { src: "assets/images/23b2371518329cd4ae9f798595ce33e0.jpg", caption: "越过肩头 · 深情相望" },
    { src: "assets/images/7698ada64fce8b2614700e77f3545573.jpg", caption: "指间微光 · 戒定终身" },
    { src: "assets/images/0ada7fda938ddc1f853cb30de08d24ee.jpg", caption: "礁石相拥 · 额头微触" },
    { src: "assets/images/12c73204f2b6332d8cc10952be0631fe.png", caption: "碧海长空 · 静坐相守" },
    { src: "assets/images/16930b6cf9719d43c1bccd12ec011cbb.jpg", caption: "倚颊相偎 · 倾心相守" },
    { src: "assets/images/be181b26caccbdf3c01364c653879bb8.jpg", caption: "白纱飞扬 · 烂漫童心" },
    { src: "assets/images/28ab68761681ea986392d033262e7254.jpg", caption: "白郁寄情 · 恬淡从容" },
    { src: "assets/images/715fc9e5feab11f78808e49372decfc6.jpg", caption: "执手廊柱 · 漫步韶华" }
  ],

  // ==================== 6. 微信分享配置 ====================
  share: {
    title: "吴德星&李婵的婚礼邀请",
    desc: "我们结婚啦，诚邀您参加我们的婚礼！",
    imgUrl: "assets/images/share_thumb.jpg"
  }
};

if (typeof window !== "undefined") {
  window.wedding = wedding;
  window.WEDDING_CONFIG = wedding;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = wedding;
}
