import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Switch, Route, Link } from 'react-router-dom';
import NewContactModal from './NewContactModal';
import EditContactModal from './EditContactModal';
import { CMErrorModal } from './common';

class ContactsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      // Set to true when the user tries to generate dummy data more than once.
      showDummiesError: false
    };
  }

  render() {
    // this.props.currentUser will be null when user directly writes '/contacts' in the URL-bar
    // or when the user pressed log out and then pressed the back button in the browser.
    if (this.props.currentUser == null) {
      return (
        <div style={ styles.authError }>
          This part of the app is only available for authorized users. <br/>
          <Link to="/login">Go to authorization page.</Link>
        </div>
      );
    }
    // If this.props.currentUser is present (it means that the user
    // was successfully authenticated) display the component itself.

    // Filters are only for display purposes that's why they are so simple
    var contacts = _.filter(this.props.contacts, contact => {
      if (!contact.name.startsWith(this.props.filters.name)) return false;
      if (!contact.phone.toString().startsWith(this.props.filters.phone)) return false;
      if (!contact.comment.startsWith(this.props.filters.comment)) return false;

      // If none of the above checks returned it means that the
      // contact has passed all the filters and should be listed.
      return true;
    });

    // Array#sort modifies the initial array but in this case it doesn't really matter.
    contacts.sort((a, b) => {
      let sortFieldName = this.props.sorting.split('_')[0].toLowerCase();
      let direction = this.props.sorting.split('_')[1];

      if (a[sortFieldName] < b[sortFieldName]) return direction == 'ASC' ? 1 : -1;
      if (a[sortFieldName] > b[sortFieldName]) return direction == 'ASC' ? -1 : 1;
      return 0;
    });

    return (
      <div style={ styles.root }>
        <div style={ styles.content }>
          <div style={ styles.tableHeader }>
            {
              [
                this.renderHeader('name', '20%', false),
                this.renderHeader('phone', '20%', false),
                this.renderHeader('comment', '40%', false),
                this.renderHeader('date', '20%', true)
              ]
            }
          </div>
          <div style={ styles.contactsList }>
            {
              _.isEmpty(contacts) ?
                <div style={ styles.emptyStub }>No contacts to display.</div> :
                _.map(contacts, contact => this.renderContact(contact))
            }
          </div>
          <div style={ styles.footer }>
            <div className="white-hover"
                 style={ styles.newContactButton }
                 onClick={ () => this.props.history.push('/contacts/create') }>
              NEW CONTACT
            </div>

            <div style={ styles.stats }>
              Total contacts - <b>{ _.size(this.props.contacts) }</b>, displayed contacts - <b>{ _.size(contacts) }</b>.
            </div>

            <div className="white-hover"
                 style={ styles.loadButton }
                 onClick={ () => this.loadDummies() }>
              LOAD THE DUMMY CONTACTS
            </div>
          </div>
        </div>

        <Switch>
          <Route path="/contacts/create"
                 render={ () => <NewContactModal onClose={ () => this.props.history.push('/contacts') }/> }/>
          <Route path="/contacts/:id(\d+)"
                 render={ props => {
                   var id = parseInt(props.match.params.id);
                   var contact = _.find(this.props.contacts, { id });

                   // If the user manually sets the url to some invalid value, for example '/contacts/99999',
                   // there should be an error which indicates that there is no such contact.
                   return contact ?
                     <EditContactModal
                       contact={ contact }
                       onClose={ error => {
                         this.props.history.push('/contacts');
                         // The contact might not be found if the user opened the site in two separate tabs,
                         // deleted the contact in one tab and now tries to delete the same contact in the first tab.
                         if (error) this.setState({ contactDoesNotExist: true });
                       } }/> :
                     <CMErrorModal onClose={ () => this.props.history.push('/contacts') }>Contact not found.</CMErrorModal>;
                 } }/>
          { /* When the user hits url like '/contacts/asdf' (which is invalid) he should be redirected */ }
          <Route path="/contacts/:id" render={ () => <Redirect to="/contacts"/> }/>
        </Switch>
        {
          this.state.showDummiesError ?
            <CMErrorModal onClose={ () => this.setState({ showDummiesError: false }) }>
              You can load the dummy contacts only once.
            </CMErrorModal> : null
        }
        {
          this.state.contactDoesNotExist ?
            <CMErrorModal onClose={ () => this.setState({ contactDoesNotExist: false }) }>
              This contact does not exist.
            </CMErrorModal> : null
        }
      </div>
    );
  }

  renderHeader(name, width, isDateColumn) {
    return (
      <div key={ name }
           style={ { ...styles.columnHeader, width: width, borderRight: isDateColumn ? 'none' : '1px solid #eee' } }>
        <div style={ styles.headerText }>{ isDateColumn ? 'CREATION DATE' : name.toUpperCase() }</div>
        <div className="light-white-hover"
             onClick={ () => this.onSortingClick(`${name.toUpperCase()}_ASC`) }
             style={ {
               ...styles.sorter,
               ...this.props.sorting == `${name.toUpperCase()}_ASC` ? styles.sorterActive : null,
               borderLeft: '1px solid #eee',
               right: '28px'
             } }>
        </div>
        <div className="light-white-hover"
             onClick={ () => this.onSortingClick(`${name.toUpperCase()}_DESC`) }
             style={ {
               ...styles.sorter,
               ...this.props.sorting == `${name.toUpperCase()}_DESC` ? styles.sorterActive : null,
               transform: 'rotate(180deg)',
               // Since we are doing rotating the border is on the right but on the left.
               borderRight: '1px solid #eee',
               right: '0px'
             } }>
        </div>
        {
          isDateColumn ?
            <input style={ { ...styles.filterInput, background: '#eee' } }
                   disabled="disabled"
                   placeholder="Filter not available"
                   type="text"/> :
            <input style={ styles.filterInput }
                   placeholder="Filter"
                   value={ this.props.filters[name] }
                   onChange={ event => this.props.dispatch({ type: 'EDIT_FILTER', name, value: event.target.value }) }
                   type="text"/>
        }
      </div>
    );
  }

  renderContact(contact) {
    return (
      <div key={ contact.id }
           className="light-white-hover"
           onClick={ () => this.props.history.push('/contacts/' + contact.id) }
           style={ styles.contact }>
        <div style={ { ...styles.column, width: '20%' } }>
          <span style={ styles.match }>
            { contact.name.slice(0, _.size(this.props.filters.name)) }
          </span>
          <span>
            { contact.name.slice(_.size(this.props.filters.name)) }
          </span>
        </div>
        <div style={ { ...styles.column, width: '20%' } }>
          <span style={ styles.match }>
            { contact.phone.toString().slice(0, _.size(this.props.filters.phone)) }
          </span>
          <span>
            { contact.phone.toString().slice(_.size(this.props.filters.phone)) }
          </span>
        </div>
        <div style={ { ...styles.column, width: '40%' } }>
          <span style={ styles.match }>
            { contact.comment.slice(0, _.size(this.props.filters.comment)) }
          </span>
          <span>
            { contact.comment.slice(_.size(this.props.filters.comment)) }
          </span>
        </div>
        <div style={ { ...styles.column, width: '20%', borderRight: 'none' } }>
          { moment(contact.date).format('YYYY MMMM DD HH:mm:ss') }
        </div>
      </div>
    );
  }

  loadDummies() {
    this.props.dispatch({ type: 'LOADING', value: true });
    axios.post('/api/dummies', {
      username: this.props.credentials.username,
      password: this.props.credentials.password
    }).then(response => {
      if (response.data == 'already-have-dummies') {
        this.setState({ showDummiesError: true });
        this.props.dispatch({ type: 'LOADING', value: false });
      } else this.props.dispatch({ type: 'DUMMIES', contacts: response.data });
    }).catch(console.error);
  }

  onSortingClick(name) {
    if (this.props.sorting != name) this.props.dispatch({ type: 'SORTING', value: name });
  }
}

ContactsPage.propTypes = {
  credentials: PropTypes.object,
  currentUser: PropTypes.object,
  contacts: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  sorting: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    contacts: state.contacts,
    filters: state.filters,
    sorting: state.sorting,
    credentials: state.credentials
  };
}

const styles = {
  authError: {
    margin: 'auto',
    textAlign: 'center'
  },
  root: {
    padding: '10px',
    height: '100%',
    width: '100%'
  },
  content: {
    backgroundColor: 'white',
    border: '1px solid rgb(15, 33, 76)',
    height: '100%'
  },
  tableHeader: {
    height: '57px',
    borderBottom: '1px solid rgb(15, 33, 76)',
    overflowY: 'scroll'
  },
  newContactButton: {
    float: 'left',
    padding: '12px 12px 12px 37px',
    height: '100%',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRight: '1px solid rgb(15, 33, 76)',
    backgroundImage: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGQ9Ik0yNiwwQzExLjY2NCwwLDAsMTEuNjYzLDAsMjZzMTEuNjY0LDI2LDI2LDI2czI2LTExLjY2MywyNi0yNlM0MC4zMzYsMCwyNiwweiBNMjYsNTBDMTIuNzY3LDUwLDIsMzkuMjMzLDIsMjZTMTIuNzY3LDIsMjYsMnMyNCwxMC43NjcsMjQsMjRTMzkuMjMzLDUwLDI2LDUweiIvPjxwYXRoIGQ9Ik0zOC41LDI1SDI3VjE0YzAtMC41NTMtMC40NDgtMS0xLTFzLTEsMC40NDctMSwxdjExSDEzLjVjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFIMjV2MTJjMCwwLjU1MywwLjQ0OCwxLDEsMXMxLTAuNDQ3LDEtMVYyN2gxMS41YzAuNTUyLDAsMS0wLjQ0NywxLTFTMzkuMDUyLDI1LDM4LjUsMjV6Ii8+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '20px',
    backgroundPosition: '10px center'
  },
  loadButton: {
    position: 'absolute',
    right: '0px',
    padding: '12px 12px 12px 37px',
    height: '100%',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    borderLeft: '1px solid rgb(15, 33, 76)',
    backgroundImage: 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGQ9Ik01MC45NzUsMTkuNjk0Yy0wLjUyNy05LTcuOTQ2LTE2LjE5NC0xNi44OTEtMTYuMTk0Yy01LjQzLDAtMTAuNjg4LDIuNjYzLTEzLjk0Niw3LjAwOGMtMC4wNzUtMC4wMzktMC4xNTUtMC4wNjYtMC4yMzEtMC4xMDNjLTAuMTk2LTAuMDk1LTAuMzk0LTAuMTg1LTAuNTk3LTAuMjY2Yy0wLjExOC0wLjA0Ny0wLjIzOC0wLjA4OS0wLjM1OC0wLjEzMWMtMC4xOTctMC4wNjktMC4zOTctMC4xMy0wLjYtMC4xODVjLTAuMTItMC4wMzItMC4yMzktMC4wNjUtMC4zNi0wLjA5M2MtMC4yMi0wLjA1LTAuNDQ0LTAuMDg4LTAuNjctMC4xMjFjLTAuMTA1LTAuMDE2LTAuMjA5LTAuMDM2LTAuMzE1LTAuMDQ4QzE2LjY3Niw5LjUyMywxNi4zNDEsOS41LDE2LDkuNWMtNC45NjIsMC05LDQuMDM3LTksOWMwLDAuMTI5LDAuMDA4LDAuMjU1LDAuMDE2LDAuMzgxQzIuODU3LDIxLjE0OCwwLDI1Ljg5OSwwLDMwLjY1NEMwLDM3LjczNyw1Ljc2Miw0My41LDEyLjg0NSw0My41SDE4YzAuNTUyLDAsMS0wLjQ0NywxLTFzLTAuNDQ4LTEtMS0xaC01LjE1NUM2Ljg2NSw0MS41LDIsMzYuNjM1LDIsMzAuNjU0YzAtNC4xNTQsMi43MDUtOC40NjYsNi40MzItMTAuMjUzTDksMjAuMTNWMTkuNWMwLTAuMTIzLDAuMDA4LTAuMjQ5LDAuMDE1LTAuMzc1bDAuMDA5LTAuMTczTDkuMDEyLDE4Ljc1QzkuMDA2LDE4LjY2Nyw5LDE4LjU4NCw5LDE4LjVjMC0zLjg1OSwzLjE0LTcsNy03YzAuMzA5LDAsMC42MTQsMC4wMjcsMC45MTcsMC4wNjdjMC4wNzgsMC4wMSwwLjE1NiwwLjAyMywwLjIzNCwwLjAzNmMwLjI2NywwLjA0NCwwLjUzLDAuMTAyLDAuNzg5LDAuMTc2YzAuMDM1LDAuMDEsMC4wNzEsMC4wMTcsMC4xMDYsMC4wMjdjMC4yODUsMC4wODcsMC41NjMsMC4xOTgsMC44MzUsMC4zMjFjMC4wNywwLjAzMiwwLjEzOSwwLjA2NiwwLjIwOCwwLjFjMC4yNDEsMC4xMTksMC40NzcsMC4yNSwwLjcwNSwwLjM5OEMyMS43MiwxMy44NzQsMjMsMTYuMDM5LDIzLDE4LjVjMCwwLjU1MywwLjQ0OCwxLDEsMXMxLTAuNDQ3LDEtMWMwLTIuNzU0LTEuMjQ2LTUuMjE5LTMuMi02Ljg3MUMyNC42NjYsNy44NzksMjkuMzg4LDUuNSwzNC4wODQsNS41YzcuNzQ0LDAsMTQuMTc4LDYuMTM1LDE0Ljg0OCwxMy44ODdjLTEuMDIyLTAuMDcyLTIuNTUzLTAuMTA5LTQuMDgzLDAuMTI1Yy0wLjU0NiwwLjA4My0wLjkyMSwwLjU5My0wLjgzOCwxLjEzOWMwLjA3NSwwLjQ5NSwwLjUwMSwwLjg1LDAuOTg3LDAuODVjMC4wNSwwLDAuMTAxLTAuMDA0LDAuMTUyLTAuMDEyYzIuMjI0LTAuMzM2LDQuNTQzLTAuMDIxLDQuNjg0LTAuMDAyQzU0LjQ5LDIyLjM3Miw1OCwyNi42NjEsNTgsMzEuNDcyQzU4LDM3LjAwMSw1My41MDEsNDEuNSw0Ny45NzIsNDEuNUg0NGMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgzLjk3MkM1NC42MDQsNDMuNSw2MCwzOC4xMDQsNjAsMzEuNDcyQzYwLDI1Ljk4Myw1Ni4xNzMsMjEuMDYsNTAuOTc1LDE5LjY5NHoiLz48cGF0aCBkPSJNMzguMjkzLDM0LjIwN0MzOC40ODgsMzQuNDAyLDM4Ljc0NCwzNC41LDM5LDM0LjVzMC41MTItMC4wOTgsMC43MDctMC4yOTNjMC4zOTEtMC4zOTEsMC4zOTEtMS4wMjMsMC0xLjQxNGwtNy45OTktNy45OTljLTAuMDkyLTAuMDkzLTAuMjAzLTAuMTY2LTAuMzI2LTAuMjE3Yy0wLjI0NC0wLjEwMS0wLjUyLTAuMTAxLTAuNzY0LDBjLTAuMTIzLDAuMDUxLTAuMjMzLDAuMTI0LTAuMzI2LDAuMjE3bC03Ljk5OSw3Ljk5OWMtMC4zOTEsMC4zOTEtMC4zOTEsMS4wMjMsMCwxLjQxNEMyMi40ODgsMzQuNDAyLDIyLjc0NCwzNC41LDIzLDM0LjVzMC41MTItMC4wOTgsMC43MDctMC4yOTNMMzAsMjcuOTE0djI1LjE3MmwtNi4yOTMtNi4yOTNjLTAuMzkxLTAuMzkxLTEuMDIzLTAuMzkxLTEuNDE0LDBzLTAuMzkxLDEuMDIzLDAsMS40MTRsNy45OTksNy45OTljMC4wOTIsMC4wOTMsMC4yMDMsMC4xNjYsMC4zMjYsMC4yMTdDMzAuNzQsNTYuNDczLDMwLjg3LDU2LjUsMzEsNTYuNXMwLjI2LTAuMDI3LDAuMzgyLTAuMDc3YzAuMTIzLTAuMDUxLDAuMjMzLTAuMTI0LDAuMzI2LTAuMjE3bDcuOTk5LTcuOTk5YzAuMzkxLTAuMzkxLDAuMzkxLTEuMDIzLDAtMS40MTRzLTEuMDIzLTAuMzkxLTEuNDE0LDBMMzIsNTMuMDg2VjI3LjkxNEwzOC4yOTMsMzQuMjA3eiIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4=)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '20px',
    backgroundPosition: '10px center'
  },
  columnHeader: {
    float: 'left',
    height: '100%',
    position: 'relative'
  },
  emptyStub: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    color: 'gray',
    fontSize: '20px'
  },
  contact: {
    overflow: 'hidden',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    display: 'flex'
  },
  column: {
    borderRight: '1px solid #eee',
    padding: '5px'
  },
  footer: {
    height: '40px',
    overflowY: 'scroll',
    position: 'relative'
  },
  contactsList: {
    height: 'calc(100% - 97px)',
    borderBottom: '1px solid rgb(15, 33, 76)',
    overflowY: 'scroll',
    position: 'relative'
  },
  sorter: {
    position: 'absolute',
    height: '28px',
    width: '28px',
    top: '0px',
    cursor: 'pointer',
    backgroundImage: 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNDA0LjMwOCA0MDQuMzA5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MDQuMzA4IDQwNC4zMDk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMCwxMDEuMDhoNDA0LjMwOEwyMDIuMTUxLDMwMy4yMjlMMCwxMDEuMDh6IiBmaWxsPSIjMDAwMDAwIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '15px'
  },
  sorterActive: {
    backgroundImage: 'url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNDA0LjMwOCA0MDQuMzA5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MDQuMzA4IDQwNC4zMDk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMCwxMDEuMDhoNDA0LjMwOEwyMDIuMTUxLDMwMy4yMjlMMCwxMDEuMDh6IiBmaWxsPSIjRDgwMDI3Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==)'
  },
  filterInput: {
    position: 'absolute',
    left: 0,
    width: '100%',
    border: 'none',
    borderTop: '1px solid #eee',
    top: '28px',
    outline: 'none',
    padding: '5px',
    fontSize: '16px',
    height: '28px'
  },
  headerText: {
    position: 'absolute',
    top: '7px',
    left: '5px',
    fontWeight: 'bold'
  },
  match: {
    fontWeight: 'bold',
    background: 'yellow'
  },
  stats: {
    float: 'left',
    height: '100%',
    position: 'relative',
    paddingTop: '12px',
    paddingLeft: '10px'
  }
};

export default connect(mapStateToProps)(ContactsPage);