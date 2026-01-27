import logo from "../assets/chat.png"

const Navbar = () => {
  return (
    <div className='bg-cyan-950 text-white flex flex-row justify-between px-3 items-center'>
       <div className='logo-text flex flex-row justify-center items-center'>
        <img src={logo} className="h-15 w-15 p-2" alt="chat-icon"  />
        <h1 className="text-xl font-semibold">ChitChat</h1>
       </div>
     <div className='navleft'>
      <h1>User Login</h1>
     </div>
    </div>
  )
}

export default Navbar
