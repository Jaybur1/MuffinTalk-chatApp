import React, { Component } from 'react';
import { VERIFY_USER } from '../Events';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            error: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    setUser = ({ user, isUser }) => {
        console.log(user, isUser)
        if (isUser) {
            this.setError('User name taken')
        } else {
            this.setError('')
            this.props.setUser(user)

        }
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.nickname);
        const { socket } = this.props
        const { nickname } = this.state
        socket.emit(VERIFY_USER, nickname, this.setUser)
        this.setState({ nickname: '' })
    }

    handleChange(event) {
        this.setState({ nickname: event.target.value })
    }

    setError = (error) => {
        this.setState({ error })
    }

    render() {
        const { nickname, error } = this.state;
        return (
            <div className="login">
                <div className="login-form-logo">
                    <img src="https://vectr.com/jaybur/efqGEpvOy.png?width=640&height=640&select=efqGEpvOypage0" alt="MuffinTalk-cat-logo" />
                </div>
                <form onSubmit={this.handleSubmit} className="login-form">
                    <label htmlFor="nickname">
                        <h2 id="login-label">Got a nickname?</h2>
                    </label>
                    <input
                        ref={(input) => { this.textInput = input }}
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={this.handleChange}
                        placeholder={'Type your cool name here'}
                    />
                    <div className="error">{error ? error : null}</div>
                </form>

                <footer>
                    Coded by Jaybur&copy; 2018
                </footer>
            </div>
        );
    }
}

export default LoginForm;