import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import classNames from 'classnames';
import withRouter from '../../hocs/withRouter';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import { changeMark, clearChangeMarkError, changeShowImage } from '../../store/slices/contestByIdSlice';
import CONSTANTS from '../../constants';
import styles from './OfferBox.module.sass';

const OfferBox = (props) => {
  const {
    data,
    role,
    id,
    contestType,
    changeShowImage,
    needButtons,
    goToExpandedDialog,
    changeMark,
    clearError,
    setOfferStatus,
  } = props;

  const { User: offerUser } = data;
  const User = offerUser || {};
  const firstName = User.firstName || '';
  const lastName = User.lastName || '';
  const displayName = User.displayName || '';
  const fullName = `${firstName} ${lastName}`.trim() || displayName || 'Creative';
  const email = User.email || 'Email unavailable';
  const avatar = User.avatar || 'anon.png';

  const [confirmAction, setConfirmAction] = useState(null);
  const [offerRating, setOfferRating] = useState(Number(data.mark) || 0);
  // Фиксируем оценку после того, как пользователь выбрал звёзды
  const [isRatingLocked, setIsRatingLocked] = useState(Boolean(Number(data.mark)));
  const [showCheckmark, setShowCheckmark] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const serverMark = Number(data.mark) || 0;
    if (serverMark > 0) {
      setOfferRating(serverMark);
      setIsRatingLocked(true);
    }
  }, [data.mark]);

  const isCreatorRole = role === CONSTANTS.CREATOR;
  const creativeRating = 5;

  const findConversationInfo = () => {
    const { messagesPreview } = props;
    const preview = messagesPreview.find(
      (item) => item.interlocutor && item.interlocutor.id === User.id
    );
    return preview
      ? {
          id: preview.id,
          blackList: preview.blackList,
          favoriteList: preview.favoriteList,
        }
      : null;
  };

  const handleOfferRatingChange = (mark) => {
    if (isRatingLocked || !mark) return;
    setOfferRating(mark);
    setIsRatingLocked(true);
    clearError();
    return changeMark({
      mark,
      offerId: data.id,
      isFirst: !data.mark,
      creatorId: User.id,
    });
  };

  const handleConfirmYes = (e) => {
    e.stopPropagation();
    if (!confirmAction || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    const actionToRun = confirmAction;

    setConfirmAction(null);
    if (actionToRun === 'resolve' || actionToRun === 'approve') {
      setShowCheckmark(true);
    }

    Promise.resolve(setOfferStatus(User.id, data.id, actionToRun)).finally(() => {
      isSubmittingRef.current = false;
    });
  };

  const handleConfirmNo = (e) => {
    e.stopPropagation();
    isSubmittingRef.current = false;
    setConfirmAction(null);
  };

  const renderStars = (ratingValue, onChangeHandler, isReadonly = false) => (
    <Rating
      initialRating={ratingValue}
      rating={ratingValue}
      readonly={isReadonly}
      onChange={onChangeHandler}
      fullSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
      placeholderSymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`} alt="star" />}
      emptySymbol={<img src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`} alt="star-outline" />}
    />
  );

  const confirmTitle =
    confirmAction === 'approve'
      ? 'Confirm approve'
      : confirmAction === 'reject'
        ? 'Confirm reject'
        : 'Confirm resolve';

  const isOfferStarsReadonly =
    isCreatorRole || User.id === id || isRatingLocked;

  return (
    <div className={styles.offerContainer}>
      {showCheckmark && (
        <i className={classNames('fas fa-check-circle resolve', styles.resolve)} />
      )}
      {data.status === CONSTANTS.OFFER_STATUS_REJECTED && (
        <i className={classNames('fas fa-times-circle reject', styles.reject)} />
      )}

      <div className={styles.mainInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.creativeInfoContainer}>
            <img
              src={
                avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${avatar}`
              }
              alt="user"
            />
            <div className={styles.nameAndEmail}>
              <span>{fullName}</span>
              <span>{email}</span>
            </div>
          </div>

          <div className={styles.creativeRating} title="Creative rating">
            <span className={styles.userScoreLabel}>Creative Rating </span>
            {renderStars(creativeRating, undefined, true)}
          </div>
        </div>

        <div className={styles.responseConainer}>
          {contestType === CONSTANTS.LOGO_CONTEST ? (
            <>
              <img
                onClick={() =>
                  changeShowImage({ imagePath: data.fileName, isShowOnFull: true })
                }
                className={styles.responseLogo}
                src={`${CONSTANTS.publicURL}${data.fileName}`}
                alt="logo"
              />
              <div className={styles.offerRatingContainer}>
                {renderStars(
                  offerRating,
                  handleOfferRatingChange,
                  isOfferStarsReadonly
                )}
              </div>
            </>
          ) : (
            <>
              <span className={styles.response}>{data.text}</span>
              <div className={styles.offerRatingContainer}>
                {renderStars(
                  offerRating,
                  handleOfferRatingChange,
                  isOfferStarsReadonly
                )}
              </div>
            </>
          )}
        </div>

        {!isCreatorRole && (
          <i
            onClick={() =>
              goToExpandedDialog({
                interlocutor: User,
                conversationData: findConversationInfo(),
              })
            }
            className="fas fa-comments"
          />
        )}
      </div>

      {needButtons(data.status) && !showCheckmark && (
        <div className={styles.btnsContainer}>
          {role === CONSTANTS.MODERATOR ? (
            <>
              <div
                onClick={() => setConfirmAction('approve')}
                className={styles.resolveBtn}
              >
                Approve
              </div>
              <div
                onClick={() => setConfirmAction('reject')}
                className={styles.rejectBtn}
              >
                Reject
              </div>
            </>
          ) : (
            <>
              <div
                onClick={() => setConfirmAction('resolve')}
                className={styles.resolveBtn}
              >
                Resolve
              </div>
              <div
                onClick={() => setConfirmAction('reject')}
                className={styles.rejectBtn}
              >
                Reject
              </div>
            </>
          )}
        </div>
      )}

      {confirmAction && !showCheckmark && (
        <div className={styles.confirmBackdrop} onClick={handleConfirmNo}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.confirmTitle}>{confirmTitle}</span>
            <span className={styles.confirmText}>Are you sure?</span>
            <div className={styles.confirmBtns}>
              <button
                type="button"
                onClick={handleConfirmYes}
                className={styles.confirmYesBtn}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={handleConfirmNo}
                className={styles.confirmNoBtn}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  id: state.userStore.data.id,
  role: state.userStore.data.role,
  messagesPreview: state.chatStore.messagesPreview,
});

const mapDispatchToProps = (dispatch) => ({
  changeMark: (data) => dispatch(changeMark(data)),
  clearError: () => dispatch(clearChangeMarkError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OfferBox));