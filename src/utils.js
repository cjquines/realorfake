import axios from "axios";

const url =
  process.env.NODE_ENV === "production"
    ? "backend/api.py"
    : "http://cjq.scripts.mit.edu/backend/api.py";

const percent = (num, denom) =>
  `${denom ? Math.floor((100 * num) / denom) : 0}%`;

const post = async (type, message, callback) => {
  const result = await axios.post(
    url,
    { ...message, type },
    { withCredentials: true }
  );
  const { status, payload } = result.data;
  if (status === "success" && callback) callback(payload);
};

export { percent, post };
