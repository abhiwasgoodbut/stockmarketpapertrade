import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.jsx'
import { Route, createBrowserRouter, createRoutesFromElements,RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Position from './pages/Position.jsx'
// import Sltp from './pages/SLTP.jsx'
// import Trades from './pages/Trades.jsx'
import Profile from './pages/Profile.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import TradePanel from './pages/TradePanel.jsx'
import AddScript from './pages/AddScript.jsx'
import RemoveScript from './pages/RemoveScript.jsx'
import Auth from './pages/Auth.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Terms from './pages/Terms.jsx'
import Deposit from './pages/Deposite.jsx'
import TransactionHistory from './pages/TransactionHistory.jsx'
import Trades from './pages/Trades.jsx'
import Withdraw from './pages/Withdraw.jsx'
import Account from './pages/Account.jsx'
import SLTP from './pages/SLTP.jsx'

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} >
      <Route path='' element={<Home/>}/>
      <Route path='position' element={<Position/>}/>
      <Route path='sl-tp' element={<SLTP/>}/>
      {/* <Route path='trades' element={<Trades/>}/> */}
      <Route path='profile' element={<Profile/>}/>
      <Route path='buysell' element={<TradePanel/>}/>
      <Route path='addscript' element={<AddScript/>}/>
      <Route path='managelist' element={<RemoveScript/>}/>
      <Route path='changepassword' element={<ChangePassword/>}/>
      <Route path='terms' element={<Terms/>}/>
      <Route path='deposit' element={<Deposit/>}/>
      <Route path='history' element={<TransactionHistory/>}/>
      <Route path='trades' element={<Trades/>}/>
      <Route path='withdraw' element={<Withdraw/>}/>
      <Route path='account' element={<Account/>}/>
      {/* <Route path="/auth" element={<Auth />} /> */}

    </Route>
  )
)


createRoot(document.getElementById('root')).render(
    <StrictMode>
    <AppContextProvider>
      <RouterProvider router={Router} />
    </AppContextProvider>
  </StrictMode>,
)
