import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="home">
      <div className="subHeading">
        <h3>How to Play</h3>
        <p>Lorem</p>
      </div>
      <div className="subHeading">
        <h3>Rules</h3>
        <p>Lorem</p>
      </div>
      <button>
        <Link to="/start">Start</Link>
      </button>
      <button>
        <Link to="/join">Join</Link>
      </button>
    </div>
  );
}
