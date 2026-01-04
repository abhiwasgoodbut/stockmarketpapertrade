import WatchlistHeader from "../components/WatchlistHeader";
import WatchlistTable from "../components/WatchlistTable";
import WatchlistTabs from "../components/WatchTabs";


const Home = () => {
  return (
    <div className="pb-20"> {/* space for bottom nav */}
      <WatchlistHeader />
      <WatchlistTabs />
      <WatchlistTable/>
    </div>
  );
};

export default Home;
