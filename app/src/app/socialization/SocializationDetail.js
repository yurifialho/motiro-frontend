import React, { Component } from 'react'
import { Form, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SocializationService from '../apps/services/SocializationService';
import AgentService from '../apps/services/AgentService';
import cogoToast from 'cogo-toast';

export class SocializationDetail extends Component {
    
    constructor(props){
        super(props)
        this.state = {
          socialization: {
            participants: [],
            communications: []
          },
          agentSelected: {},
          listAgents: [],
        }

       // this.handleChange = this.handleChange.bind(this);
       this.handleAgentSelect = this.handleAgentSelect.bind(this);
    }
    
    componentDidMount(){
        this.loadAgents();
        let id = (this.state.socialization.id || this.props.match.params.id )
        if (id) {
            this.load(id);
        }
    }

    async load(id){
        try {
            let ret = await SocializationService.getOne(id);
            if (ret.status === 200) {
                this.setState({socialization: ret.data});
            } else {
                cogoToast.error("Could not to get Socialization Data.");
            }
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not to get Socialization Data.");
        }
    }

    async loadAgents() {
        try {
            let ret = await AgentService.list();
            if ( ret.status === 200 ){
                let listAgents = [];
                for (let i=0; i < ret.data.length; i++) {
                    let check = true;
                    for (let y=0; y < this.state.socialization.participants.length; y++ ) {
                        if ( this.state.socialization.participants[y].id == ret.data[i].id ) {
                            check = false;
                            break;
                        }
                    }
                    if ( check ) {
                        listAgents.push(ret.data[i]);
                    }
                }
                
                this.setState({listAgents: listAgents});
            } else {
                cogoToast.error("Could not to get Agents List.");
            }
        } catch(error) {
            console.error(error)
            cogoToast.error("Could not to get Agents List.");
        }
    }
    
    async save() {
        try {
            let socialization = this.state.socialization;
            let ret = null;
            if (socialization.id) {
                ret = await SocializationService.edit(socialization);
            } else {
                ret = await SocializationService.create(socialization);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.load(ret.data.id);
                cogoToast.success("Socialization saved");
            }
         } catch(error) {
            console.error(error)
            cogoToast.error("Could not to save");
        }
    }

    handleChange(event) {
        const obj = event.target;
        switch (obj.id) {
            case 'socializationNameInput': {
                let process = this.state.process;
                process.name = obj.value;
                this.setState({process: process});
                break;
            }
        }
    }

    handleAgentSelect(eventKey, event) {
        let agentSelected = {}
        for (let i=0; i < this.state.listAgents.length; i++) {
            if ( eventKey == this.state.listAgents[i].id ) {
                agentSelected = this.state.listAgents[i];
                break;
            }
        }
        
        this.setState({ agentSelected: agentSelected })
    }

    linkAgent() {
        let agentSelected = this.state.agentSelected;
        let socialization = this.state.socialization;
        for (let i=0; i < socialization.participants.length; i++) {
            if ( agentSelected.id == socialization.participants[i].id ){
                cogoToast.error("Agent already linked!");
                return
            }
        }
        socialization.participants.push(agentSelected);
        this.setState({socialization: socialization});
        this.loadAgents();
        cogoToast.warn("Agent Linked, but you need save after to persist!");
    }

    
    render() {
        return (
        <div>
        <div className="page-header">
            <h3 className="page-title">Socialization Detail</h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item" aria-current="page"><Link to="/socialization">Socialization</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Socialization Detail</li>
                </ol>
            </nav>
        </div>
        <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">             
            <div className="card">       
                <div className="card-body">
                    <div className="d-flex flex-row justify-content-between">
                        <div className="justify-content-between">
                            <h4 className="card-title">(#{ this.state.socialization.id }) { this.state.socialization.name }</h4>
                        </div>
                        <div className="justify-content-between">
                            <Link to='/socialization'>
                            <button type="button" className="btn btn-danger" >
                                <i className="mdi mdi-window-close"></i>
                                Cancel
                            </button>
                            </Link>
                            <button type="button" className="btn btn-success" onClick={ () => { this.save() }}>
                                <i className="mdi mdi-content-save"></i>
                                Save
                            </button>
                        </div>
                    </div>
                    
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="socializationNameInput">Name</label>
                            <Form.Control type="text" id="socializationNameInput" placeholder="Socialization Name" value={this.state.socialization.name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="socializationDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="socializationDescriptionInput" row={4} value={this.state.socialization.description || ''} onChange={this.handleChange}/>
                        </Form.Group>
                    </Form> 
                </div>
            </div>
            </div>
        </div>

        <div className="row">
            <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <h4 className="card-title">Participants</h4>
                <Form onSubmit={ event => event.preventDefault() }>
                    <Form.Group>
                        <label htmlFor="processDescriptionInput">Agent</label>
                        <InputGroup>
                            <DropdownButton variant='success' title="Agents" as={InputGroup.Prepend}>
                                { this.state.listAgents.map( (agent, index) => (
                                    <Dropdown.Item 
                                        key={"dropitem-agents-key-id"+index}
                                        eventKey={ agent.id }
                                        onSelect={ this.handleAgentSelect }
                                        onSubmit={ event => event.preventDefault() }>
                                        {agent.name} 
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <Form.Control  id='agentName' name='agentName' type="text" className="form-control" 
                                    placeholder="Agent Name" aria-label="Activity Objective Name" 
                                    aria-describedby="basic-addon2" value={ this.state.agentSelected.name || '' } readOnly />
                            <InputGroup.Append>
                                {   ( this.state.agentSelected.id ) &&
                                    <button className="btn btn-sm btn-success" type="button" onClick={ () => this.linkAgent() } >+</button>
                                }
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Form>
                <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.socialization.participants.map( (a, index) => (
                        <tr key={"agent-id-"+a.id}>
                            <td>{a.id}</td>
                            <td>{a.name}</td>
                            <td>
                                <div className="btn-group" role="group" aria-label="bt-group-activity">
                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.deleteActivity(a.id)}>
                                        <i className="mdi mdi-delete-forever"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}  
                    </tbody>
                </table>
                </div>
            </div>
            </div>
            </div>

            <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <div className="d-flex flex-row justify-content-between">
                    <div className="justify-content-between">
                    <h4 className="card-title">Messages</h4>
                    </div>
                    <div className="justify-content-between">
                        <button type="button" className="btn btn-success" onClick={ () => { this.saveActivity() }}>
                            <i className="mdi mdi-email"></i>
                            New Message
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.socialization.communications.map( (s, index) => (
                        <tr key={"spec-id-"+s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{ s.agent != null && 
                                this.getAgentNameById(s.agent)
                            }
                            </td>
                            <td>
                                <div className="btn-group" role="group" aria-label="bt-group-activity">
                                    <button type="button" className="btn btn-warning btn-sm" onClick={ () => this.editActivity(s)}>
                                        <i className="mdi mdi-eye"></i>
                                    </button>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => this.deleteActivity(s.id)}>
                                        <i className="mdi mdi-delete-forever"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}  
                    </tbody>
                </table>
                </div>
            </div>
            </div>
            </div>
        </div>

        <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
                <div className="d-flex flex-row justify-content-between">
                    <div className="justify-content-between">
                    <h4 className="card-title">Messages Flow Activations</h4>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Activity Source</th>
                        <th>Activity Target</th>
                        <th>Nº Transactions/Messages</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    </table>
                </div>
            </div>
            </div>
            </div>
        </div>

        </div>
        );
    }

}

export default SocializationDetail;