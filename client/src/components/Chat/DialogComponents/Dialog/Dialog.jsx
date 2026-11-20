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
    const interlocutorId = this.props.interlocutor?.id;
    if (interlocutorId) {
      this.props.getDialog({ interlocutorId });
    }
    this.scrollToBottom();
  }

  messagesEnd = React.createRef();

  scrollToBottom = () => {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  componentDidUpdate(prevProps) {
    const prevId = prevProps.interlocutor?.id;
    const currentId = this.props.interlocutor?.id;

    if (currentId && prevId !== currentId) {
      this.props.getDialog({ interlocutorId: currentId });
    }

    if (this.messagesEnd.current) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    this.props.clearMessageList();
  }

  renderMainDialog = () => {
    const messagesArray = [];
    const messages = Array.isArray(this.props.messages) ? this.props.messages : [];
    const { userId } = this.props;
    let currentTime = moment();

    messages.forEach((message, i) => {
      if (!message) return;

      if (message.createdAt && !currentTime.isSame(message.createdAt, 'date')) {
        messagesArray.push(
          <div key={`date-${message.id || message.createdAt}-${i}`} className={styles.date}>
            {moment(message.createdAt).format('MMMM DD, YYYY')}
          </div>
        );
        currentTime = moment(message.createdAt);
      }

      messagesArray.push(
        <div
          key={message.id || `msg-${i}`}
          className={className(
            userId === message.sender ? styles.ownMessage : styles.message
          )}
        >
          <span>{message.body}</span>
          <span className={styles.messageTime}>
            {message.createdAt ? moment(message.createdAt).format('HH:mm') : ''}
          </span>
        </div>
      );
    });

    return (
      <div className={styles.messageList}>
        {messagesArray}
        <div ref={this.messagesEnd} />
      </div>
    );
  };

  blockMessage = () => (
    <span className={styles.messageBlock}>This conversation is blocked</span>
  );

  render() {
    const { chatData, userId, interlocutor } = this.props;

    if (!interlocutor || !interlocutor.id) {
      return null;
    }

    return (
      <>
        <ChatHeader userId={userId} />
        {this.renderMainDialog()}
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