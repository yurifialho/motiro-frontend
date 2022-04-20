import React, { Component } from 'react'
import { Modal, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AgentService from '../apps/services/AgentService';

export class AgentDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            agent: {}
        }
    }

    componentDidMount() {
        console.log(this.props.location)
        this.loadAgent();
    }


    loadAgent(){
        console.log("Agent Loaded");
    }

    render() {
        return (
            <>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                    <h4 className="card-title">Agent</h4>
                    <div className="table-responsive">
                        Content
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Agent Details</h4>
                    <div className="table-responsive">
                    </div>
                </div>
                </div>
                </div>

                <div className="col-lg-3 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Desire</h4>
                    Content
                </div>
                </div>
                </div>


                <div className="col-lg-3 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Specialty</h4>
                    Content
                </div>
                </div>
                </div>
            </div>
            </>);
    }

}

export default AgentDetail;