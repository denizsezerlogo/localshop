import { MSG } from '../constants/messages';

export default function Loader({ label = MSG.LOADING }) {
  return (
    <div className="loader-wrap" role="status">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
