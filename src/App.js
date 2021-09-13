import './App.css';
import Portfolio from './components/Portfolio';
import Home from './components/Home';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import useAuth from './components/Auth/useAuth';
import firebase, { FirebaseContext } from './firebase/index';

function App() {
  const user = useAuth();
  return (
    <FirebaseContext.Provider value={{ user, firebase }}>
      <>
        <Navbar user={user}/>
        {user ? (
          <Portfolio user={user}/>
        ) : (
          <Home />
        )}
        <Footer />
      </>
    </FirebaseContext.Provider>

  );
}

export default App;
