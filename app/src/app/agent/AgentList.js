import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form } from 'react-bootstrap';
import AgentTypeService from '../apps/services/AgentTypeService';
import { Truncate } from '../apps/util/Truncate';


export class AgentList extends Component {

    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          agent: {},
          agents: [],
          agentTypes: [],
          alerts: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.loadAgents();
       this.loadAgentType();
    }

    async loadAgents(){
        try {
          /*let ret = await AgentTypeService.list();
          if (ret.status === 200){
            this.setState({agents: ret.data, agent: {}});  
          }     */     
        } catch(error) {
          console.log(error)
          alert("Não foi possível listar")
        }
    }

    async loadAgentType() {
        try {
            let ret = await AgentTypeService.list();
            if (ret.status === 200){
                this.setState({agentTypes: ret.data, agentType: {}});
            }
        } catch(error) {
            console.log(error)
            alert("Não foi possível listar os tipos")
        }
    }

    async deleteAgent(id){
        try {
          let ret = await AgentTypeService.delete(id);
          this.loadAgents();
        } catch(error) {
          console.log(error)
          alert("Não foi possivel excluir!")
        }
    }

    async createAgent() {
        try {
            let agent = this.state.agent;
            let ret = null;
            if (agent.id) {
                ret = await AgentTypeService.edit(agent);
            } else {
                ret = await AgentTypeService.create(agent);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.loadAgents();
                this.showModal(false)
            }
            
         } catch(error) {
            console.log(error)
            alert("Não foi possivel criar!")
        }
    }

    async editAgent(id) {
        try {
            let ret = await AgentTypeService.getOne(id)
            if (ret.status === 200) {
                this.setState({agent: ret.data})
                this.showModal(true)
            }            
         } catch(error) {
            console.log(error)
            alert("Não foi possivel obter dados!")
        }
    }

    showModal(val) {
        if (!val){
            this.setState({agent: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        if (obj.id === 'agentNameInput') {
            let agent = this.state.agent
            agent.name = obj.value
            this.setState({agent: agent})
        }
        if (obj.id === 'agentDescriptionInput') {
            let agent = this.state.agent
            agent.description = obj.value
            this.setState({agent: agent})
        }
    }

    render() {
        return (
        <div className="col-lg-12 grid-margin stretch-card">
             
        <div className="card">
       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Agents</h4>
                <Link to="/agents/0">
                <button type="button" className="btn btn-success" >
                    <i className="mdi mdi-plus-circle-outline"></i>
                    Add
                </button>
                </Link>
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
                    {this.state.agents.map( agent => (
                    <tr key={ "agent-id-"+agent.id } >
                        <td> { agent.id } </td>
                        <td> { agent.name } </td>
                        <td> <Truncate text={agent.description} size={20}/> </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={() => this.editAgent(agent.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.deleteAgent(agent.id)} >
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
            <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
                <div className="card-body">
                <h4 className="card-title">
                    { this.state.agent.id ? "(#"+this.state.agent.id+") " : "" } 
                    Agent 
                    { this.state.agent.name ? " - "+this.state.agent.name : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="agentNameInput">Name</label>
                            <Form.Control type="text" id="agentNameInput" placeholder="Agent Name" value={this.state.agent.name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="agentTypeSelect">Type</label>
                            <select className="form-control" id="agentTypeSelect">
                                <option>Select One Type</option>
                                {this.state.agentTypes.map( type => (
                                    <option value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="agentDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="agentDescriptionInput" row={4} value={this.state.agent.description || ''} onChange={this.handleChange}/>
                        </Form.Group>
                    </Form>
                </div>
                </div>
            </div>
            </div>
            </div>
            <div className="row">
                <div className="col-lg-3 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Process</h4>
                    Teste
                </div>
                </div>
                </div>
                
                <div className="col-lg-6 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Process Details</h4>
                    <div className="table-responsive">
                    </div>
                </div>
                </div>
                </div>

                <div className="col-lg-3 grid-margin stretch-card">
                <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Process</h4>
                    Teste
                </div>
                </div>
                </div>
            </div>
            <Modal.Footer>
                <button type="button" className="btn btn-danger" onClick={ () => this.showModal(false) }>
                    <i className="mdi mdi-window-close"></i>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={ () => this.createAgent()}>
                    <i className="mdi mdi-content-save"></i>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
        </div>
        );
    }

}

export default AgentList;