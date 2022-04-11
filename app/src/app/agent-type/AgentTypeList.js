import React, { Component, useState } from 'react'
import { Modal, Form, Alert } from 'react-bootstrap';
import AgentTypeService from '../apps/services/AgentTypeService';
import { Truncate } from '../apps/util/Truncate';


export class AgentType extends Component {

    

    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          agentType: {},
          agentTypes: [],
          alerts: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.loadAgentTypes();
    }

    async loadAgentTypes(){
        try {
          let ret = await AgentTypeService.list();
          this.setState({agentTypes: ret.data, agentType: {}});
        } catch(error) {
          console.log(error)
          alert("Não foi possível listar")
        }
    }

    async deleteAgentType(id){
        try {
          let ret = await AgentTypeService.delete(id);
          this.loadAgentTypes();
        } catch(error) {
          console.log(error)
          alert("Não foi possivel excluir!")
        }
    }

    async createAgentType() {
        try {
            let agentType = this.state.agentType;
            let ret = null;
            if (agentType.id) {
                ret = await AgentTypeService.edit(agentType);
            } else {
                ret = await AgentTypeService.create(agentType);
            }
            
            if (ret.status == 200 ||  ret.status == 201) {
                this.loadAgentTypes();
                this.showModal(false)
            }
            
         } catch(error) {
            console.log(error)
            alert("Não foi possivel criar!")
        }
    }

    async editAgentType(id) {
        try {
            let ret = await AgentTypeService.getOne(id)
            if (ret.status == 200) {
                this.setState({agentType: ret.data})
                this.showModal(true)
            }            
         } catch(error) {
            console.log(error)
            alert("Não foi possivel obter dados!")
        }
    }

    showModal(val) {
        if (!val){
            this.setState({agentType: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        if (obj.id == 'agentNameInput') {
            let agent = this.state.agentType
            agent.name = obj.value
            this.setState({agentType: agent})
        }
        if (obj.id == 'agentDescriptionInput') {
            let agent = this.state.agentType
            agent.description = obj.value
            this.setState({agentType: agent})
        }
    }

    render() {
        return (
        <div className="col-lg-12 grid-margin stretch-card">
             
        <div className="card">
       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Agent Type</h4>
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
                    {this.state.agentTypes.map( type => (
                    <tr>
                        <td> { type.id } </td>
                        <td> { type.name } </td>
                        <td> <Truncate text={type.description} size={20}/> </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={() => this.editAgentType(type.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.deleteAgentType(type.id)} >
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
                    { this.state.agentType.id ? "(#"+this.state.agentType.id+") " : "" } 
                    Agent Type 
                    { this.state.agentType.name ? " - "+this.state.agentType.name : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="agentNameInput">Name</label>
                            <Form.Control type="text" id="agentNameInput" placeholder="Agent Name" value={this.state.agentType.name || ''} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="agentDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="agentDescriptionInput" row={4} value={this.state.agentType.description || ''} onChange={this.handleChange}/>
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
                <button type="button" className="btn btn-primary" onClick={ () => this.createAgentType()}>
                    <i className="mdi mdi-content-save"></i>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
        </div>
        );
    }

}

export default AgentType;