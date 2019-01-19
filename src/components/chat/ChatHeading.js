import React, { Component } from 'react';
import { Tooltip, Icon } from 'react-mdl'


class ChatHeading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuStatus: 'close'
        }
    }

    handleMenu = () => {

        this.state.menuStatus === 'open' ? this.setState({ menuStatus: 'close' }) : this.setState({ menuStatus: 'open' })
        this.props.setMenu(this.state.menuStatus)
        console.log(this.state.menuStatus)

    }

    render() {
        const { name } = this.props

        const { menuStatus } = this.state
        return (
            <div className="chat-header">
                <div className="menu-control" style={{ cursor: 'pointer' }}
                    onClick={this.handleMenu}
                >{
                        menuStatus === 'open' ?
                            <Tooltip label="Open Menu" position="right">
                                <Icon name="arrow_forward" />
                            </Tooltip>
                            :
                            <Tooltip label="Close Menu" position="left">
                                <Icon name="arrow_back" />
                            </Tooltip>
                    }
                </div>
                <div className="user-info">
                    <div className="user-name">{name}</div>
                    <div className="status">
                        <div className="indicator"></div>
                    </div>
                </div>
                <div className="options">
                    <img src="https://vectr.com/jaybur/efqGEpvOy.png?width=640&height=640&select=efqGEpvOypage0" alt="MuffinTalk-cat-logo" />
                </div>
            </div>

        );
    }
}

export default ChatHeading;