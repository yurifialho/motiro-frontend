import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';

class Sidebar extends Component {

  state = {};

  toggleMenuState(menuState) {
    console.log(menuState)
    if (this.state[menuState]) {
      this.setState({[menuState] : false});
    } else if(Object.keys(this.state).length === 0) {
      this.setState({[menuState] : true});
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({[i]: false});
      });
      this.setState({[menuState] : true}); 
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({[i]: false});
    });

    const dropdownPaths = [
      {path: '/basic-records', state: 'basicRecordsOpen'}
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({[obj.state] : true})
      }
    }));
 
  }

  render () {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a className="sidebar-brand brand-logo" href="index.html"><img src={require('../../assets/images/logo.png')} alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini" href="index.html"><img src={require('../../assets/images/logo-mini.svg')} alt="logo" /></a>
        </div>
        <ul className="nav">
          <li className="nav-item nav-category">
            <span className="nav-link">Menu</span>
          </li>
          <li className={ this.isPathActive('/basic-records') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <div className={ this.state.basicRecordsOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => this.toggleMenuState('basicRecordsOpen') } data-toggle="collapse">
              <span className="menu-title">Basic Records</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ this.state.basicRecordsOpen }>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><Link className={ this.isPathActive('/basic-records/agent-type') ? 'nav-link active' : 'nav-link' } to="/basic-records/agent-type">Agent Type</Link></li>
                  <li className="nav-item"><Link className={ this.isPathActive('/basic-records/agent-specialty') ? 'nav-link active' : 'nav-link' } to="/basic-records/agent-specialty">Agent Specialty</Link></li>
                  <li className="nav-item"> <Link className={ this.isPathActive('/basic-records/process-goal') ? 'nav-link active' : 'nav-link' } to="/basic-records/process-goal">Process Goal</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);