import React, { Component } from 'react';

class MessageInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isTyping: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentWillUnmount() {
        this.stopCheckingTyping()
    }

    handleKeyUp = (event) => {
        event.keyCode !== 13 && this.sendTyping()
    }

    sendTyping = () => {
        this.lastUpdateTime = Date.now()
        if (!this.state.isTyping) {
            this.setState({ isTyping: true })
            this.props.sendTyping(true)
            this.startCheckingTyping()
        }
    }

    startCheckingTyping = () => {
        console.log('Typing')
        this.typingInterval = setInterval(() => {
            if ((Date.now() - this.lastUpdateTime) > 300) {
                this.setState({ isTyping: false })
                this.stopCheckingTyping()
            }
        }, 300)
    }

    stopCheckingTyping = () => {
        console.log('not typing')
        if (this.typingInterval) {
            clearInterval(this.typingInterval)
            this.props.sendTyping(false)
        }
    }

    handleChange = (event) => {
        this.setState({
            message: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.sendMessage()
        this.setState({ message: '' })
    }

    sendMessage = () => {
        this.props.sendMessage(this.state.message)
    }

    render() {
        const { message } = this.state
        return (
            <div className="message-input">
                <form
                    onSubmit={this.handleSubmit}
                    className="message-form"
                >
                    <input
                        id="message"
                        ref={"messageinput"}
                        type="text"
                        className="form-control"
                        value={message}
                        autoComplete={'off'}
                        placeholder="type your message here"
                        onKeyUp={this.handleKeyUp}
                        onChange={this.handleChange}

                    />
                    <button
                        disabled={message.length < 1}
                        type="submit"
                        className="send"
                    >
                        Send
                    </button>
                </form>
            </div>
        );
    }
}

export default MessageInput;