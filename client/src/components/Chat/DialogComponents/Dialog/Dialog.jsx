import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import className from 'classnames';
import {
  getDialogMessages,
  clearMessageList,
} from '../../../../store/slices/chatSlice';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';

class Dialog extends React.Component {
  componentDidMount() {
    this.props.getDialog({ interlocutorId: this.props.interlocutor.id });
    this.scrollToBottom();
  }

  messagesEnd = React.createRef();

  scrollToBottom = () => {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.interlocutor.id !== this.props.interlocutor.id) {
      this.props.getDialog({ interlocutorId: this.props.interlocutor.id });
    }
    if (this.messagesEnd.current) this.scrollToBottom();
  }

  componentWillUnmount() {
    this.props.clearMessageList();
  }

  renderMainDialog = () => {
    const messagesArray = [];
    const { messages, userId } = this.props;
    let currentTime = moment();
    messages.forEach((message, i) => {
      if (!currentTime.isSame(message.createdAt, 'date')) {
        messagesArray.push(
          <div key={message.createdAt} className={styles.date}>
            {moment(message.createdAt).format('MMMM DD, YYYY')}
          </div>
        );
        currentTime = moment(message.createdAt);
      }
      messagesArray.push(
        <div
          key={i}
          className={className(
            userId === message.sender ? styles.ownMessage : styles.message
          )}
        >
          <span>{message.body}</span>
          <span className={styles.messageTime}>
            {moment(message.createdAt).format('HH:mm')}
          </span>
          <div ref={this.messagesEnd} />
        </div>
      );
    });
    return <div className={styles.messageList}>{messagesArray}</div>;
  };

  blockMessage = () => (
    <span className={styles.messageBlock}>This conversation is blocked</span>
  );

  render() {
    const { chatData, userId } = this.props;
    return (
      <>
        <ChatHeader userId={userId} />
        {this.renderMainDialog()}
        <div ref={this.messagesEnd} />
        {chatData && chatData.blackList ? (
          this.blockMessage()
        ) : (
          <ChatInput />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  getDialog: (data) => dispatch(getDialogMessages(data)),
  clearMessageList: () => dispatch(clearMessageList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
