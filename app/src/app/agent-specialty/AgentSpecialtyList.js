import React, { Component } from 'react'
import { Modal, Form } from 'react-bootstrap';
import AgentSpecialtyService from '../apps/services/AgentSpecialtyService';
import { Truncate } from '../apps/util/Truncate';
import cogoToast from 'cogo-toast';

export class AgentSpecialtyList extends Component {

    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          agentSpecialty: {},
          agentSpecialties: [],
          alerts: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.loadAgentSpecialties();
    }

    async loadAgentSpecialties(){
        try {
          let ret = await AgentSpecialtyService.list();
          this.setState({agentSpecialties: ret.data, agentSpecialty: {}});
        } catch(error) {
          console.log(error)
          cogoToast.error("Cannot load the list");
        }
    }

    async deleteAgentSpecialty(id){
        try {
          let ret = await AgentSpecialtyService.delete(id);
          
          if (ret.status === 204) {
            cogoToast.success("Agent Specialty Deleted");
            this.loadAgentSpecialties();
          } else {
            cogoToast.error("Cannot exclude");
          }
        } catch(error) {
          console.log(error)
          cogoToast.error("Cannot exclude");
        }
    }

    async createAgentSpecialty() {
        try {
            let agentSpecialty = this.state.agentSpecialty;
            let ret = null;
            if (agentSpecialty.id) {
                ret = await AgentSpecialtyService.edit(agentSpecialty);
            } else {
                ret = await AgentSpecialtyService.create(agentSpecialty);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                cogoToast.success("Agent Specialty saved")
                this.loadAgentSpecialties();
                this.showModal(false)
            } else {
                cogoToast.error("Cannot create agent type");
            }            
         } catch(error) {
            console.log(error)
            cogoToast.error("Cannot create agent type");
        }
    }

    async editAgentSpecialty(id) {
        try {
            let ret = await AgentSpecialtyService.getOne(id)
            if (ret.status === 200) {
                this.setState({agentSpecialty: ret.data})
                this.showModal(true)
            } else {
                cogoToast.error("Cannot get data");    
            }            
         } catch(error) {
            console.log(error)
            cogoToast.error("Cannot get data");
        }
    }

    showModal(val) {
        if (!val){
            this.setState({agentSpecialty: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        if (obj.id === 'agentNameInput') {
            let agent = this.state.agentSpecialty
            agent.l_name = obj.value
            this.setState({agentSpecialty: agent})
        }
        if (obj.id === 'agentDescriptionInput') {
            let agent = this.state.agentSpecialty
            agent.l_description = obj.value
            this.setState({agentSpecialty: agent})
        }
    }

    render() {
        return (
        <div className="col-lg-12 grid-margin stretch-card">             
        <div className="card">       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Agent Specialty</h4>
                <button type="button" className="btn btn-success" onClick={ () => this.showModal(true) }>
                    <i className="mdi mdi-plus-circle-outline"></i>
                    Add
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr>
                    <th> # </th>
                    <th> Name </th>
                    <th> Description </th>
                    <th> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.agentSpecialties.map( specialty => (
                    <tr key={ "agentspecialty-id-"+specialty.id } >
                        <td> <Truncate text={specialty.id} size={8} complement=" "/> </td>
                        <td> { specialty.l_name } </td>
                        <td> <Truncate text={specialty.l_description} size={20}/> </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={() => this.editAgentSpecialty(specialty.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.deleteAgentSpecialty(specialty.id)} >
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
        <Modal show={ this.state.modalShow } aria-labelledby="contained-modal-title-vcenter" centered >
            <div className="card">
                <div className="card-body">
                <h4 className="card-title">
                    { this.state.agentSpecialty.id ? "(#"+this.state.agentSpecialty.id+") " : "" } 
                    Agent Specialty
                    { this.state.agentSpecialty.l_name ? " - "+this.state.agentSpecialty.l_name : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="agentNameInput">Name</label>
                            <Form.Control type="text" id="agentNameInput" placeholder="Agent Specialty Name" value={this.state.agentSpecialty.l_name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="agentDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="agentDescriptionInput" row={4} value={this.state.agentSpecialty.l_description || ''} onChange={this.handleChange}/>
                        </Form.Group>
                    </Form>
                </div>
                </div>
            </div>
            <Modal.Footer>
                <button type="button" className="btn btn-danger" onClick={ () => this.showModal(false) }>
                    <i className="mdi mdi-window-close"></i>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={ () => this.createAgentSpecialty()}>
                    <i className="mdi mdi-content-save"></i>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
        </div>
        );
    }

}

export default AgentSpecialtyList;