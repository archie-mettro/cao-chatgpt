import { useState, useEffect } from 'react'


const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)
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

  const preLoadMessage = async () => {
    let site_url = "http://localhost:8000" //"https://cao-api.onrender.com"
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: 'Welcome to Carpet One Stafford! How can I help you today?',
        role: 'assistant'
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try{
      const response = await fetch( site_url + '/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }


  const getMessages = async () => {
    let site_url = "https://cao-api.onrender.com"
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try{
      const response = await fetch( site_url + '/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

  

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   fetch('http://localhost:8000', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({message}),
  //   })
  //   .then((res) => res.json())
  //   .then((data) => setResponse(data.message))
  // }



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
            role: "user",
            content: value
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

  console.log(previousChats)

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
        </ul>
        <div className="bottom-section">
          <div className="input-container">

              <input  value={value} onChange={(e) => setValue(e.target.value)} />
              <div id="submit" onClick={getMessages}>Send</div>

              {/* <form onSubmit={handleSubmit}>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <button type="submit">Submit</button>
              </form> */}
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
