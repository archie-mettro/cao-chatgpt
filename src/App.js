import { useState, useEffect, useRef } from 'react'
import typingImage from './typing-texting.gif'


const ChatMessage = ({ message }) => {
  return (
    <p style={{ whiteSpace: 'pre-line' }}>{replaceProductInfoWithImages(message)}</p>
  )
}

function replaceProductInfoWithImages(text) {
  const productNameRegex = /Products Name: (.+)/g;
  const productImageRegex = /Product Image: (.+)/g;

  let replacedText = text;
  let productImageMatch;

  while ((productImageMatch = productImageRegex.exec(text))) {

    const productImage = productImageMatch[1];

    const imgTag = `<img width="100" src="${productImage}" alt="" />`;

    replacedText = replacedText.replace(productImageMatch[0], imgTag);
  }

  return replacedText;
}


const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage] = useState(null)
  const [ isSent, setIsSent] = useState(0)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)
  const inputRef = useRef(null)
  const typingImageUrl = typingImage
  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")    
  }

  const getMessages = async () => {
    let site_url = "https://cao-web-api.onrender.com"
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === ""){
      site_url = "http://localhost:8000"
    }


    setIsSent(1)
    inputRef.current.value = "";
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
        previousChats: previousChats,
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
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message){
      setCurrentTitle(value)
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "User",
            content: value
          },
          {
            title: currentTitle,
            role: "Assistant",
            content: message.content
          }
        ]
      ))
    }


  }, [message, currentTitle])


  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
 
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))


  function extractProducts(text) {
    const productRegex = /Products name: (.+)\nProduct Image: (.+)/g
    const products = []
    let match
  
    while ((match = productRegex.exec(text)) !== null) {
      const name = match[1]
      const image = match[2]
      products.push({ name, image })
    }
  
    return products
  }
  

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
          <li><p class="role">Assistant:</p><p>Welcome to Carpet One Stafford! How can I help you today?</p></li>
          {currentChat.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}:</p>
            {/* <p>{chatMessage.content}</p> */}
            
            {/* <ChatMessage message={chatMessage.content} /> */}
            <pre dangerouslySetInnerHTML={{ __html: replaceProductInfoWithImages(chatMessage.content) }}></pre>
           </li>)}

            
            {isSent == 1 && (<li><p className="role">User:</p><p>{value}</p></li>)}
            {isSent == 1 && (<li className='assistant-wrapper'><p className="role">Assistant:</p><p className='loading-wrapper'><img className="typing-image" src={typingImageUrl} /></p></li>)}
            
        </ul>
        <div className="bottom-section">
          <div className="input-container">

              <input ref={inputRef}  onChange={(e) => setValue(e.target.value)} />
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
