import { useState, useEffect } from 'react'
import typingImage from './typing-texting.gif'

const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage] = useState(null)
  const [ isSent, setIsSent] = useState(0)
  const [ paramValue, setParamValue] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)
  const typingImageUrl = typingImage
  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setParamValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
    setParamValue("")
  }

  const getMessages = async () => {
    let site_url = "https://cao-api.onrender.com"
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === ""){
      site_url = "http://localhost:8000"
    }


    setIsSent(1)
    setParamValue(value)
    setValue("")
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: paramValue,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try{
      const response = await fetch( site_url + '/completions', options)
      
      const data = await response.json()
      setMessage(data.choices[0].message)
      setIsSent(0)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log(currentTitle, paramValue, message)
    if (!currentTitle && paramValue && message){
      setCurrentTitle(paramValue)
    }
    if(currentTitle && paramValue && message){
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "user",
            content: paramValue
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }


  }, [message, currentTitle])


  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
 
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  

  return (
    <div className="app">
      <section className="side-bar">
          <button onClick={createNewChat}>+ New chat</button>
          <ul className="history">
            {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
          </ul>
          <nav>
            Products
          </nav>
      </section>
      <section className="main">
        {/* {!currentTitle && <h3>Welcome to Carpet One Stafford! How can I help you today?</h3>} */}
        <ul className="feed">
          <li><p class="role">assistant</p><p>Welcome to Carpet One Stafford! How can I help you today?</p></li>
          {currentChat.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
           </li>)}

            
            {isSent == 1 && (<li><p className="role">user</p><p>{paramValue}</p></li>)}
            {isSent == 1 && (<li className='assistant-wrapper'><p className="role">assistant</p><p className='loading-wrapper'><img className="typing-image" src={typingImageUrl} /></p></li>)}
            
        </ul>
        <div className="bottom-section">
          <div className="input-container">

              <input  value={value} onChange={(e) => setValue(e.target.value)} />
              <div id="submit" onClick={getMessages}>Send</div>
          </div>
          <p className="info">
          Carla, our virtual assistant, is a work in progress, but she is always learning and improving. We appreciate your patience as Carla continues to learn and grow.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App
