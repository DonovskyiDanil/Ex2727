import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import LightBox from 'react-18-image-lightbox';
import withRouter from '../../hocs/withRouter';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import {
  getContestById,
  setOfferStatus,
  clearSetOfferStatusError,
  clearChangeMarkError,
  changeEditContest,
  changeContestViewMode,
  changeShowImage,
} from '../../store/slices/contestByIdSlice';
import ContestSideBar from '../../components/ContestSideBar/ContestSideBar';
import styles from './ContestPage.module.sass';
import OfferBox from '../../components/OfferBox/OfferBox';
import OfferForm from '../../components/OfferForm/OfferForm';
import CONSTANTS from '../../constants';
import Brief from '../../components/Brief/Brief';
import Spinner from '../../components/Spinner/Spinner';
import TryAgain from '../../components/TryAgain/TryAgain';
import 'react-18-image-lightbox/style.css';
import Error from '../../components/Error/Error';
import { getUserStats } from '../../api/rest/restController';

class ContestPage extends React.Component {
  state = {
    pendingOffersCount: null,
    pendingOffersLoading: true,
    pendingOffersError: false,
  };

  componentWillUnmount() {
    this.props.changeEditContest(false);
  }

  componentDidMount() {
    this.getData();
    if (this.props.userStore.data?.role === CONSTANTS.CREATOR) {
      getUserStats()
        .then(({ data }) => {
          this.setState({
            pendingOffersCount: Number(data?.stats?.pendingReview || 0),
            pendingOffersLoading: false,
            pendingOffersError: false,
          });
        })
        .catch((error) => {
          console.error('Could not load pending offer count:', error);
          this.setState({ pendingOffersLoading: false, pendingOffersError: true });
        });
    }
  }

  getData = () => {
    const { id } = this.props.params;
    if (id) this.props.getData({ contestId: id });
  };

  needButtons = (offerStatus) => {
    const { contestData } = this.props.contestByIdStore;
    const { data } = this.props.userStore;

    if (!contestData || !data || contestData.status !== CONSTANTS.CONTEST_STATUS_ACTIVE) return false;

    const isOwner = contestData.userId == data.id || (contestData.User && contestData.User.id == data.id);

    if (data.role === CONSTANTS.MODERATOR) {
      return offerStatus === CONSTANTS.OFFER_STATUS_PENDING;
    }

    if (data.role === CONSTANTS.CUSTOMER && isOwner) {
      return offerStatus === CONSTANTS.OFFER_STATUS_APPROVED;
    }

    return false;
  };

  handleOfferStatusClick = (creatorId, offerId, command) => {
    this.executeStatusChange(creatorId, offerId, command);
  };

  executeStatusChange = (creatorId, offerId, command) => {
    this.props.clearSetOfferStatusError();
    const { contestData } = this.props.contestByIdStore;

    if (contestData) {
      const { id, orderId, priority } = contestData;
      const obj = { command, offerId, creatorId, orderId, priority, contestId: id };
      this.props.setOfferStatus(obj);
    }
  };

  setOffersList = () => {
    const { offers, contestData } = this.props.contestByIdStore;
    if (!offers || offers.length === 0) {
      return <div className={styles.notFound}>There is no suggestion at this moment</div>;
    }

    return offers.map((offer) => (
      <OfferBox
        data={offer}
        key={offer.id}
        needButtons={this.needButtons}
        setOfferStatus={this.handleOfferStatusClick}
        contestType={contestData.contestType}
        date={new Date()}
      />
    ));
  };

  goChat = () => {
    const { User } = this.props.contestByIdStore.contestData;
    this.props.goToExpandedDialog({
      interlocutor: User,
      conversationData: null,
    });
  };

  render() {
    const { userStore, contestByIdStore, changeShowImage, changeContestViewMode, clearSetOfferStatusError } = this.props;
    const { data: userData } = userStore;
    const { isShowOnFull, imagePath, error, isFetching, isBrief, contestData, setOfferStatusError } = contestByIdStore;

    if (!userData) return <Spinner />;

    return (
      <div className={styles.mainContainer}>
        {isShowOnFull && (
          <LightBox
            mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
            onCloseRequest={() => changeShowImage({ isShowOnFull: false, imagePath: null })}
          />
        )}

        {error ? (
          <div className={styles.tryContainer}><TryAgain getData={this.getData} /></div>
        ) : isFetching ? (
          <div className={styles.containerSpinner}><Spinner /></div>
        ) : (
          <div className={styles.mainInfoContainer}>
            <div className={styles.infoContainer}>
              <div className={styles.buttonsContainer}>
                <span onClick={() => changeContestViewMode(true)} className={classNames(styles.btn, { [styles.activeBtn]: isBrief })}>Brief</span>
                <span onClick={() => changeContestViewMode(false)} className={classNames(styles.btn, { [styles.activeBtn]: !isBrief })}>Offer</span>
              </div>
              {isBrief ? (
                <Brief contestData={contestData} role={userData.role} goChat={this.goChat} />
              ) : (
                <div className={styles.offersContainer}>
                  {userData.role === CONSTANTS.CREATOR && (
                    <span className={styles.pendingOffers}>
                      {this.state.pendingOffersError
                        ? 'Pending offer count is unavailable'
                        : this.state.pendingOffersLoading
                          ? 'Loading pending offer count'
                          : `${this.state.pendingOffersCount} ${this.state.pendingOffersCount === 1 ? 'offer' : 'offers'} pending`}
                      <span className={styles.pendingReviewLabel}> on review</span>
                    </span>
                  )}
                  {userData.role === CONSTANTS.CREATOR && contestData?.status === CONSTANTS.CONTEST_STATUS_ACTIVE && (
                    <div className={styles.formWrapper}>
                      <OfferForm contestType={contestData.contestType} contestId={contestData.id} customerId={contestData.userId} />
                    </div>
                  )}
                  {setOfferStatusError && <Error data={setOfferStatusError.data} status={setOfferStatusError.status} clearError={clearSetOfferStatusError} />}
                  {contestByIdStore.changeMarkError && (
                    <Error
                      data={contestByIdStore.changeMarkError.data}
                      status={contestByIdStore.changeMarkError.status}
                      clearError={this.props.clearChangeMarkError}
                    />
                  )}
                  <div className={styles.offers}>{this.setOffersList()}</div>
                </div>
              )}
            </div>
            {contestData && <ContestSideBar contestData={contestData} totalEntries={contestByIdStore.offers.length} />}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  contestByIdStore: state.contestByIdStore,
  userStore: state.userStore,
  chatStore: state.chatStore
});

const mapDispatchToProps = (dispatch) => ({
  getData: (data) => dispatch(getContestById(data)),
  setOfferStatus: (data) => dispatch(setOfferStatus(data)),
  clearSetOfferStatusError: () => dispatch(clearSetOfferStatusError()),
  clearChangeMarkError: () => dispatch(clearChangeMarkError()),
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeEditContest: (data) => dispatch(changeEditContest(data)),
  changeContestViewMode: (data) => dispatch(changeContestViewMode(data)),
  changeShowImage: (data) => dispatch(changeShowImage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContestPage));