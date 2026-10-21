// Core railway network data used across search, booking, reservation,
// scheduling and live tracking experiences.

export const STATIONS = {
  BCT: { code: "BCT", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", lat: 18.9696, lng: 72.8194 },
  CSMT: { code: "CSMT", name: "Mumbai CSMT", city: "Mumbai", state: "Maharashtra", lat: 18.9398, lng: 72.8355 },
  PUNE: { code: "PUNE", name: "Pune Junction", city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  NDLS: { code: "NDLS", name: "New Delhi", city: "Delhi", state: "Delhi", lat: 28.643, lng: 77.2197 },
  BRC: { code: "BRC", name: "Vadodara Junction", city: "Vadodara", state: "Gujarat", lat: 22.3107, lng: 73.1812 },
  RTM: { code: "RTM", name: "Ratlam Junction", city: "Ratlam", state: "Madhya Pradesh", lat: 23.3315, lng: 75.0367 },
  KOTA: { code: "KOTA", name: "Kota Junction", city: "Kota", state: "Rajasthan", lat: 25.18, lng: 75.8333 },
  ADI: { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  ST: { code: "ST", name: "Surat", city: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  BPL: { code: "BPL", name: "Bhopal Junction", city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  ET: { code: "ET", name: "Itarsi Junction", city: "Itarsi", state: "Madhya Pradesh", lat: 22.6148, lng: 77.7622 },
  NGP: { code: "NGP", name: "Nagpur Junction", city: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  KZJ: { code: "KZJ", name: "Kazipet Junction", city: "Warangal", state: "Telangana", lat: 17.9975, lng: 79.594 },
  SC: { code: "SC", name: "Secunderabad Junction", city: "Hyderabad", state: "Telangana", lat: 17.4399, lng: 78.4983 },
  HYB: { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  BZA: { code: "BZA", name: "Vijayawada Junction", city: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lng: 80.648 },
  MAS: { code: "MAS", name: "MGR Chennai Central", city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  SBC: { code: "SBC", name: "KSR Bengaluru", city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  JP: { code: "JP", name: "Jaipur Junction", city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  GGN: { code: "GGN", name: "Gurgaon", city: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266 },
  AGC: { code: "AGC", name: "Agra Cantt", city: "Agra", state: "Uttar Pradesh", lat: 27.1591, lng: 78.018 },
  GWL: { code: "GWL", name: "Gwalior Junction", city: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lng: 78.1828 },
  JHS: { code: "JHS", name: "Virangana Lakshmibai Jhansi", city: "Jhansi", state: "Uttar Pradesh", lat: 25.4484, lng: 78.5685 },
  CNB: { code: "CNB", name: "Kanpur Central", city: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
  LKO: { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  HWH: { code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal", lat: 22.5839, lng: 88.3425 },
  DHN: { code: "DHN", name: "Dhanbad Junction", city: "Dhanbad", state: "Jharkhand", lat: 23.7957, lng: 86.4304 },
  GAYA: { code: "GAYA", name: "Gaya Junction", city: "Gaya", state: "Bihar", lat: 24.7955, lng: 84.9994 },
  PNBE: { code: "PNBE", name: "Patna Junction", city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  BBS: { code: "BBS", name: "Bhubaneswar", city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  TVC: { code: "TVC", name: "Thiruvananthapuram Central", city: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  ERS: { code: "ERS", name: "Ernakulam Junction", city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  CLT: { code: "CLT", name: "Kozhikode", city: "Kozhikode", state: "Kerala", lat: 11.2588, lng: 75.7804 },
  CAN: { code: "CAN", name: "Kannur", city: "Kannur", state: "Kerala", lat: 11.8745, lng: 75.3704 },
  TLY: { code: "TLY", name: "Thalassery", city: "Thalassery", state: "Kerala", lat: 11.748, lng: 75.492 },
  BDJ: { code: "BDJ", name: "Vadakara", city: "Vadakara", state: "Kerala", lat: 11.607, lng: 75.586 },
  QLD: { code: "QLD", name: "Quilandi", city: "Quilandi", state: "Kerala", lat: 11.438, lng: 75.687 },
  MAJN: { code: "MAJN", name: "Mangaluru Junction", city: "Mangaluru", state: "Karnataka", lat: 12.9141, lng: 74.856 },
  MAO: { code: "MAO", name: "Madgaon Junction", city: "Goa", state: "Goa", lat: 15.2993, lng: 74.124 },
};

export const STATION_LIST = Object.values(STATIONS).sort((a, b) => a.city.localeCompare(b.city));

export const CLASS_META = {
  SL: { code: "SL", label: "Sleeper", base: 60, rate: 0.55, tone: "sky" },
  "3A": { code: "3A", label: "AC 3 Tier", base: 350, rate: 1.2, tone: "teal" },
  "2A": { code: "2A", label: "AC 2 Tier", base: 600, rate: 1.75, tone: "violet" },
  "1A": { code: "1A", label: "First AC", base: 1200, rate: 2.9, tone: "amber" },
  CC: { code: "CC", label: "AC Chair Car", base: 250, rate: 1.05, tone: "sky" },
  EC: { code: "EC", label: "Executive Chair", base: 700, rate: 2.2, tone: "amber" },
};

export const TRAINS = [
  {
    number: "12951",
    name: "Mumbai Rajdhani Express",
    tag: "Rajdhani",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A"],
    route: [
      { code: "BCT", arr: null, dep: "17:00", day: 1, km: 0 },
      { code: "BRC", arr: "20:38", dep: "20:48", day: 1, km: 392 },
      { code: "RTM", arr: "23:48", dep: "23:58", day: 1, km: 636 },
      { code: "KOTA", arr: "03:00", dep: "03:10", day: 2, km: 917 },
      { code: "NDLS", arr: "08:32", dep: null, day: 2, km: 1384 },
    ],
  },
  {
    number: "12952",
    name: "New Delhi Rajdhani Express",
    tag: "Rajdhani",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A"],
    route: [
      { code: "NDLS", arr: null, dep: "16:25", day: 1, km: 0 },
      { code: "KOTA", arr: "21:40", dep: "21:50", day: 1, km: 467 },
      { code: "RTM", arr: "00:50", dep: "01:00", day: 2, km: 748 },
      { code: "BRC", arr: "03:55", dep: "04:05", day: 2, km: 992 },
      { code: "BCT", arr: "08:35", dep: null, day: 2, km: 1384 },
    ],
  },
  {
    number: "12002",
    name: "Bhopal Shatabdi Express",
    tag: "Shatabdi",
    days: [1, 2, 3, 4, 5, 6],
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "NDLS", arr: null, dep: "06:00", day: 1, km: 0 },
      { code: "AGC", arr: "07:55", dep: "07:57", day: 1, km: 195 },
      { code: "GWL", arr: "09:05", dep: "09:07", day: 1, km: 313 },
      { code: "JHS", arr: "10:20", dep: "10:25", day: 1, km: 411 },
      { code: "BPL", arr: "14:05", dep: null, day: 1, km: 701 },
    ],
  },
  {
    number: "12001",
    name: "New Delhi Shatabdi Express",
    tag: "Shatabdi",
    days: [1, 2, 3, 4, 5, 6],
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "BPL", arr: null, dep: "15:15", day: 1, km: 0 },
      { code: "JHS", arr: "18:40", dep: "18:45", day: 1, km: 290 },
      { code: "GWL", arr: "19:55", dep: "19:57", day: 1, km: 388 },
      { code: "AGC", arr: "21:05", dep: "21:07", day: 1, km: 506 },
      { code: "NDLS", arr: "23:50", dep: null, day: 1, km: 701 },
    ],
  },
  {
    number: "12009",
    name: "Mumbai Pune Shatabdi Express",
    tag: "Shatabdi",
    days: "daily",
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "BCT", arr: null, dep: "06:25", day: 1, km: 0 },
      { code: "PUNE", arr: "09:45", dep: null, day: 1, km: 192 },
    ],
  },
  {
    number: "12010",
    name: "Pune Mumbai Shatabdi Express",
    tag: "Shatabdi",
    days: "daily",
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "PUNE", arr: null, dep: "17:15", day: 1, km: 0 },
      { code: "BCT", arr: "20:25", dep: null, day: 1, km: 192 },
    ],
  },
  {
    number: "12007",
    name: "Chennai Bengaluru Shatabdi Express",
    tag: "Shatabdi",
    days: [1, 2, 3, 4, 5, 6],
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "MAS", arr: null, dep: "06:00", day: 1, km: 0 },
      { code: "SBC", arr: "11:00", dep: null, day: 1, km: 362 },
    ],
  },
  {
    number: "12008",
    name: "Bengaluru Chennai Shatabdi Express",
    tag: "Shatabdi",
    days: [1, 2, 3, 4, 5, 6],
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "SBC", arr: null, dep: "16:30", day: 1, km: 0 },
      { code: "MAS", arr: "21:30", dep: null, day: 1, km: 362 },
    ],
  },
  {
    number: "12627",
    name: "Karnataka Express",
    tag: "Superfast",
    days: "daily",
    status: "Delayed by 20 min",
    classes: ["1A", "2A", "3A", "SL"],
    route: [
      { code: "NDLS", arr: null, dep: "20:45", day: 1, km: 0 },
      { code: "AGC", arr: "23:10", dep: "23:15", day: 1, km: 195 },
      { code: "JHS", arr: "01:45", dep: "01:55", day: 2, km: 411 },
      { code: "BPL", arr: "05:35", dep: "05:45", day: 2, km: 702 },
      { code: "ET", arr: "07:20", dep: "07:30", day: 2, km: 793 },
      { code: "NGP", arr: "12:15", dep: "12:25", day: 2, km: 1090 },
      { code: "KZJ", arr: "19:05", dep: "19:10", day: 2, km: 1449 },
      { code: "SC", arr: "21:40", dep: "21:50", day: 2, km: 1531 },
      { code: "SBC", arr: "08:20", dep: null, day: 3, km: 2184 },
    ],
  },
  {
    number: "12628",
    name: "Karnataka Express",
    tag: "Superfast",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A", "SL"],
    route: [
      { code: "SBC", arr: null, dep: "11:15", day: 1, km: 0 },
      { code: "SC", arr: "20:40", dep: "20:50", day: 1, km: 653 },
      { code: "KZJ", arr: "22:55", dep: "23:00", day: 1, km: 735 },
      { code: "NGP", arr: "04:05", dep: "04:15", day: 2, km: 1094 },
      { code: "ET", arr: "09:10", dep: "09:20", day: 2, km: 1391 },
      { code: "BPL", arr: "10:55", dep: "11:05", day: 2, km: 1482 },
      { code: "JHS", arr: "14:45", dep: "14:55", day: 2, km: 1773 },
      { code: "AGC", arr: "17:25", dep: "17:30", day: 2, km: 1989 },
      { code: "NDLS", arr: "20:10", dep: null, day: 2, km: 2184 },
    ],
  },
  {
    number: "12723",
    name: "Telangana Express",
    tag: "Superfast",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A", "SL"],
    route: [
      { code: "NDLS", arr: null, dep: "06:50", day: 1, km: 0 },
      { code: "AGC", arr: "09:00", dep: "09:05", day: 1, km: 195 },
      { code: "GWL", arr: "10:10", dep: "10:12", day: 1, km: 313 },
      { code: "JHS", arr: "11:25", dep: "11:35", day: 1, km: 411 },
      { code: "BPL", arr: "15:10", dep: "15:20", day: 1, km: 702 },
      { code: "NGP", arr: "20:15", dep: "20:25", day: 1, km: 1090 },
      { code: "KZJ", arr: "02:10", dep: "02:15", day: 2, km: 1449 },
      { code: "SC", arr: "04:30", dep: "04:40", day: 2, km: 1531 },
      { code: "HYB", arr: "05:10", dep: null, day: 2, km: 1548 },
    ],
  },
  {
    number: "12724",
    name: "Telangana Express",
    tag: "Superfast",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A", "SL"],
    route: [
      { code: "HYB", arr: null, dep: "16:10", day: 1, km: 0 },
      { code: "SC", arr: "16:35", dep: "16:45", day: 1, km: 17 },
      { code: "KZJ", arr: "18:50", dep: "18:55", day: 1, km: 99 },
      { code: "NGP", arr: "23:55", dep: "00:05", day: 2, km: 458 },
      { code: "BPL", arr: "04:40", dep: "04:50", day: 2, km: 846 },
      { code: "JHS", arr: "08:20", dep: "08:30", day: 2, km: 1137 },
      { code: "GWL", arr: "09:40", dep: "09:42", day: 2, km: 1235 },
      { code: "AGC", arr: "10:50", dep: "10:55", day: 2, km: 1353 },
      { code: "NDLS", arr: "15:00", dep: null, day: 2, km: 1548 },
    ],
  },
  {
    number: "12622",
    name: "Tamil Nadu Express",
    tag: "Superfast",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A", "SL"],
    route: [
      { code: "NDLS", arr: null, dep: "22:30", day: 1, km: 0 },
      { code: "AGC", arr: "00:35", dep: "00:40", day: 2, km: 195 },
      { code: "JHS", arr: "03:10", dep: "03:20", day: 2, km: 411 },
      { code: "BPL", arr: "07:00", dep: "07:10", day: 2, km: 702 },
      { code: "NGP", arr: "12:05", dep: "12:15", day: 2, km: 1090 },
      { code: "BZA", arr: "19:35", dep: "19:45", day: 2, km: 1750 },
      { code: "MAS", arr: "07:15", dep: null, day: 3, km: 2175 },
    ],
  },
  {
    number: "12621",
    name: "Tamil Nadu Express",
    tag: "Superfast",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A", "SL"],
    route: [
      { code: "MAS", arr: null, dep: "22:00", day: 1, km: 0 },
      { code: "BZA", arr: "09:15", dep: "09:25", day: 2, km: 425 },
      { code: "NGP", arr: "16:40", dep: "16:50", day: 2, km: 1085 },
      { code: "BPL", arr: "21:30", dep: "21:40", day: 2, km: 1473 },
      { code: "JHS", arr: "01:15", dep: "01:25", day: 3, km: 1764 },
      { code: "AGC", arr: "03:50", dep: "03:55", day: 3, km: 1980 },
      { code: "NDLS", arr: "06:30", dep: null, day: 3, km: 2175 },
    ],
  },
  {
    number: "12301",
    name: "Howrah Rajdhani Express",
    tag: "Rajdhani",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A"],
    route: [
      { code: "HWH", arr: null, dep: "16:50", day: 1, km: 0 },
      { code: "DHN", arr: "19:35", dep: "19:40", day: 1, km: 259 },
      { code: "GAYA", arr: "21:40", dep: "21:45", day: 1, km: 456 },
      { code: "CNB", arr: "03:10", dep: "03:15", day: 2, km: 1002 },
      { code: "NDLS", arr: "10:00", dep: null, day: 2, km: 1451 },
    ],
  },
  {
    number: "12302",
    name: "New Delhi Howrah Rajdhani Express",
    tag: "Rajdhani",
    days: "daily",
    status: "On time",
    classes: ["1A", "2A", "3A"],
    route: [
      { code: "NDLS", arr: null, dep: "16:55", day: 1, km: 0 },
      { code: "CNB", arr: "21:30", dep: "21:35", day: 1, km: 449 },
      { code: "GAYA", arr: "02:55", dep: "03:00", day: 2, km: 995 },
      { code: "DHN", arr: "05:05", dep: "05:10", day: 2, km: 1192 },
      { code: "HWH", arr: "08:00", dep: null, day: 2, km: 1451 },
    ],
  },
  {
    number: "12985",
    name: "Jaipur Delhi Double Decker",
    tag: "Intercity",
    days: "daily",
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "JP", arr: null, dep: "06:00", day: 1, km: 0 },
      { code: "GGN", arr: "09:45", dep: "09:47", day: 1, km: 271 },
      { code: "NDLS", arr: "10:30", dep: null, day: 1, km: 303 },
    ],
  },
  {
    number: "12986",
    name: "Delhi Jaipur Double Decker",
    tag: "Intercity",
    days: "daily",
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "NDLS", arr: null, dep: "17:35", day: 1, km: 0 },
      { code: "GGN", arr: "18:20", dep: "18:22", day: 1, km: 32 },
      { code: "JP", arr: "22:05", dep: null, day: 1, km: 303 },
    ],
  },
  {
    number: "20901",
    name: "Mumbai Gandhinagar Vande Bharat",
    tag: "Vande Bharat",
    days: [1, 2, 3, 4, 5, 6],
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "BCT", arr: null, dep: "17:40", day: 1, km: 0 },
      { code: "ST", arr: "20:15", dep: "20:17", day: 1, km: 263 },
      { code: "ADI", arr: "22:25", dep: null, day: 1, km: 493 },
    ],
  },
  {
    number: "20902",
    name: "Gandhinagar Mumbai Vande Bharat",
    tag: "Vande Bharat",
    days: [1, 2, 3, 4, 5, 6],
    status: "On time",
    classes: ["CC", "EC"],
    route: [
      { code: "ADI", arr: null, dep: "06:00", day: 1, km: 0 },
      { code: "ST", arr: "08:05", dep: "08:07", day: 1, km: 230 },
      { code: "BCT", arr: "10:25", dep: null, day: 1, km: 493 },
    ],
  },
  {
    number: "16528",
    name: "Kannur Kozhikode Express",
    tag: "Coastal",
    days: "daily",
    status: "On time",
    classes: ["SL", "CC"],
    route: [
      { code: "CAN", arr: null, dep: "18:05", day: 1, km: 0 },
      { code: "TLY", arr: "18:24", dep: "18:25", day: 1, km: 21 },
      { code: "BDJ", arr: "18:39", dep: "18:40", day: 1, km: 43 },
      { code: "QLD", arr: "18:59", dep: "19:00", day: 1, km: 65 },
      { code: "CLT", arr: "19:35", dep: null, day: 1, km: 90 },
    ],
  },
  {
    number: "16529",
    name: "Kozhikode Kannur Express",
    tag: "Coastal",
    days: "daily",
    status: "On time",
    classes: ["SL", "CC"],
    route: [
      { code: "QLD", arr: null, dep: "18:05", day: 1, km: 0 },
      { code: "BDJ", arr: "18:24", dep: "18:25", day: 1, km: 21 },
      { code: "TLY", arr: "18:39", dep: "18:40", day: 1, km: 43 },
      { code: "CAN", arr: "18:59", dep: null, day: 1, km: 65 },
    ],
  },
];

// Additional timetable records retained from the original project.
// These appear in timetable search but are not sold through the booking flow.
export const LEGACY_SCHEDULES = {
  "16531": {
    name: "Kannur Vijayawada Express",
    route: [
      { code: "CAN", arr: "—", dep: "18:05", day: 1, km: 0 },
      { code: "TLY", arr: "18:24", dep: "18:25", day: 1, km: 21 },
      { code: "BDJ", arr: "18:39", dep: "18:40", day: 1, km: 43 },
      { code: "QLD", arr: "18:59", dep: "19:00", day: 1, km: 65 },
      { code: "CLT", arr: "19:30", dep: "19:35", day: 1, km: 90 },
      { code: "BZA", arr: "22:45", dep: "—", day: 1, km: 250 },
    ],
  },
  "16577": {
    name: "Kannur Coastal Passenger",
    route: [
      { code: "CAN", arr: "—", dep: "18:05", day: 1, km: 0 },
      { code: "TLY", arr: "18:24", dep: "18:25", day: 1, km: 21 },
      { code: "BDJ", arr: "18:39", dep: "18:40", day: 1, km: 43 },
      { code: "QLD", arr: "18:59", dep: "19:00", day: 1, km: 65 },
    ],
  },
  "16580": {
    name: "Kozhikode Vijayawada Link",
    route: [
      { code: "QLD", arr: "—", dep: "18:05", day: 1, km: 0 },
      { code: "BDJ", arr: "18:24", dep: "18:25", day: 1, km: 21 },
      { code: "TLY", arr: "18:39", dep: "18:40", day: 1, km: 43 },
      { code: "CAN", arr: "18:59", dep: "19:00", day: 1, km: 65 },
      { code: "CLT", arr: "19:30", dep: "19:35", day: 1, km: 90 },
      { code: "BZA", arr: "22:45", dep: "—", day: 1, km: 250 },
    ],
  },
  "2443150": {
    name: "Coastal Superfast Special",
    route: [
      { code: "CAN", arr: "—", dep: "18:05", day: 1, km: 0 },
      { code: "TLY", arr: "18:24", dep: "18:25", day: 1, km: 21 },
      { code: "BDJ", arr: "18:39", dep: "18:40", day: 1, km: 43 },
      { code: "QLD", arr: "18:59", dep: "19:00", day: 1, km: 65 },
      { code: "CLT", arr: "19:30", dep: "19:35", day: 1, km: 90 },
      { code: "BZA", arr: "01:30", dep: "—", day: 2, km: 400 },
    ],
  },
  "2443119": {
    name: "Coastal Festival Special",
    route: [
      { code: "CAN", arr: "—", dep: "18:05", day: 1, km: 0 },
      { code: "TLY", arr: "18:24", dep: "18:25", day: 1, km: 21 },
      { code: "BDJ", arr: "18:39", dep: "18:40", day: 1, km: 43 },
      { code: "QLD", arr: "18:59", dep: "19:00", day: 1, km: 65 },
      { code: "CLT", arr: "19:30", dep: "19:35", day: 1, km: 90 },
      { code: "BZA", arr: "01:30", dep: "—", day: 2, km: 400 },
    ],
  },
};

export const POPULAR_ROUTES = [
  { from: "BCT", to: "NDLS", label: "Mumbai → Delhi", hint: "Rajdhani" },
  { from: "NDLS", to: "BPL", label: "Delhi → Bhopal", hint: "Shatabdi" },
  { from: "MAS", to: "SBC", label: "Chennai → Bengaluru", hint: "Shatabdi" },
  { from: "BCT", to: "PUNE", label: "Mumbai → Pune", hint: "Shatabdi" },
  { from: "JP", to: "NDLS", label: "Jaipur → Delhi", hint: "Double Decker" },
  { from: "HWH", to: "NDLS", label: "Howrah → Delhi", hint: "Rajdhani" },
];

export function getTrain(number) {
  return TRAINS.find((train) => train.number === String(number).trim());
}

export function getStation(code) {
  return STATIONS[code] || { code, name: code, city: code, state: "" };
}

export function getSchedule(number) {
  const train = getTrain(number);
  if (train) return { number: train.number, name: train.name, route: train.route, classes: train.classes };
  const legacy = LEGACY_SCHEDULES[String(number).trim()];
  if (legacy) return { number: String(number), name: legacy.name, route: legacy.route, classes: [] };
  return null;
}

export function routeDistance(route) {
  return route[route.length - 1].km - route[0].km;
}

export function searchTrains(from, to) {
  if (!from || !to || from === to) return [];
  return TRAINS.map((train) => {
    const fromIndex = train.route.findIndex((stop) => stop.code === from);
    const toIndex = train.route.findIndex((stop) => stop.code === to);
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null;
    const fromStop = train.route[fromIndex];
    const toStop = train.route[toIndex];
    const departure = fromStop.dep || fromStop.arr;
    const arrival = toStop.arr || toStop.dep;
    const departureMinutes = (fromStop.day - 1) * 1440 + toMinutes(departure);
    const arrivalMinutes = (toStop.day - 1) * 1440 + toMinutes(arrival);
    return {
      train,
      fromStop,
      toStop,
      departure,
      arrival,
      duration: arrivalMinutes - departureMinutes,
      distance: toStop.km - fromStop.km,
      dayOffset: toStop.day - fromStop.day,
    };
  }).filter(Boolean);
}

export function toMinutes(time) {
  if (!time || time === "—") return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
