import React, { Component } from 'react';
import { SideBarOption } from './SideBarOption'
import { get, last, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../../Factories'
import FAChevronDown from 'react-icons/lib/md/keyboard-arrow-down'
import MdPowerSettingsNew from 'react-icons/lib/md/power-settings-new'
import { Badge } from 'react-mdl'

class SideBar extends Component {
    static type = {
        CHATS: "chats",
        USERS: "users"
    }
    constructor(props) {
        super(props);
        this.state = {

            activeSideBar: SideBar.type.CHATS,
        }
    }

    handleChange = (event) => {
        this.setState({ search: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const { search } = this.state
        const { onSendPrivateMessage } = this.props
        this.setState({ search: '' })
        onSendPrivateMessage(search)
    }

    addChatForUser = (username) => {
        this.setState({ activeSideBar: SideBar.type.CHATS })
        this.props.onSendPrivateMessage(username)
    }

    setActiveSideBar = (activeSideBar) => {
        this.setState({ activeSideBar })
    }

    render() {
        const { chats, activeChat, user, setActiveChat, logout, users, setMenu } = this.props
        const { activeSideBar, } = this.state
        return (
            <div id="side-bar" style={setMenu === 'close' ? { width: '0%' } : {}}>
                <div className="heading">
                    <div className="app-name">MuffinTalk Chat<FAChevronDown /></div>
                </div>
                <div className="side-bar-select">
                    <div className={`side-bar-select__option ${activeSideBar === SideBar.type.CHATS ? 'active' : ''}`}
                        onClick={() => { this.setActiveSideBar(SideBar.type.CHATS) }}
                    >
                        <span>Chats</span>
                    </div>
                    <div className={`side-bar-select__option ${activeSideBar === SideBar.type.USERS ? 'active' : ''}`}
                        onClick={() => { this.setActiveSideBar(SideBar.type.USERS) }}
                    >
                        {
                            users.length > 1 ?
                                <Badge text={String(users.length - 1)} noBackground>Users</Badge>
                                :
                                <span>Users</span>
                        }

                    </div>
                </div>
                <div
                    className="users"
                    ref='users'
                    onClick={(event) => { (event.target === this.refs.user) && setActiveChat(null) }}>
                    {
                        activeSideBar === SideBar.type.CHATS ?
                            chats.map((chat) => {
                                if (chat.name) {
                                    return (
                                        <SideBarOption
                                            key={chat.id}
                                            name={chat.isGeneral ? chat.name : createChatNameFromUsers(chat.users, user.name)}
                                            lastMessage={get(last(chat.messages), 'message', '')}
                                            active={activeChat.id === chat.id}
                                            onClick={() => { this.props.setActiveChat(chat) }}
                                        />
                                    )
                                }

                                return null
                            })
                            :
                            differenceBy(users, [user], 'name').map((otherUser) => {
                                return (
                                    <SideBarOption
                                        key={otherUser.id}
                                        name={otherUser.name}
                                        onClick={() => {
                                            this.addChatForUser(otherUser.name)
                                        }}
                                    />
                                )
                            })
                    }

                </div>
                <div className="current-user">
                    <span>{user.name}</span>
                    <div onClick={() => { logout() }} title="Logout" className="logout">
                        <MdPowerSettingsNew />
                    </div>
                </div>
            </div>
        );
    }
}

export default SideBar;

