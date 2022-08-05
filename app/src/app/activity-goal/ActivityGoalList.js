import React, { Component } from 'react'
import { Modal, Form } from 'react-bootstrap';
import ActivityGoalService from '../apps/services/ActivityGoalService';
import { Truncate } from '../apps/util/Truncate';
import cogoToast from 'cogo-toast';

export class ActivityGoalList extends Component {
    
    constructor(props){
        super(props)
        this.state = {
          modalShow: false,
          activityGoal: {},
          listActivityGoal: []
        }

        this.handleChange = this.handleChange.bind(this);

    }
    
    componentDidMount(){
       this.loadActivityGoals();
    }

    async loadActivityGoals(){
        try {
          let ret = await ActivityGoalService.list();
          this.setState({listActivityGoal: ret.data, activityGoal: {}});
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not to get data list.");
        }
    }

    async deleteActivityGoal(id){
        try {
          let ret = await ActivityGoalService.delete(id);
          if (ret.status === 204) {
            cogoToast.success("Activity Goal was deleted");
            this.loadActivityGoals();
          } else {
            cogoToast.error("Could not delete");
          }          
        } catch(error) {
          console.log(error)
          cogoToast.error("Could not delete");
        }
    }

    async save() {
        try {
            let goal = this.state.activityGoal;
            let ret = null;
            if (goal.id) {
                ret = await ActivityGoalService.edit(goal);
            } else {
                ret = await ActivityGoalService.create(goal);
            }
            
            if (ret.status === 200 ||  ret.status === 201) {
                this.loadActivityGoals();
                this.showModal(false)
                cogoToast.success("Activity Goal saved")
            }
            
         } catch(error) {
            console.log(error)
            cogoToast.error("Could not to save");
        }
    }

    async edit(id) {
        try {
            let ret = await ActivityGoalService.getOne(id)
            if (ret.status === 200) {
                this.setState({activityGoal: ret.data})
                this.showModal(true)
            }            
         } catch(error) {
            console.log(error)
            cogoToast.error("Could not to get data");
        }
    }

    showModal(val) {
        if (!val){
            this.setState({activityGoal: {}})
        }
        this.setState({modalShow: val})        
    }

    handleChange(event) {
        const obj = event.target
        if (obj.id === 'goalNameInput') {
            let goal = this.state.activityGoal
            goal.l_name = obj.value
            this.setState({activityGoal: goal})
        }
        if (obj.id === 'goalDescriptionInput') {
            let goal = this.state.activityGoal
            goal.l_description = obj.value
            this.setState({activityGoal: goal})
        }
    }

    render() {
        return (
        <div className="col-lg-12 grid-margin stretch-card">             
        <div className="card">       
            <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
                <h4 className="card-title">Activity Goal</h4>
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
                    <th> Linked to </th>
                    <th> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.listActivityGoal.map( goal => (
                    <tr key={ "activitygoal-id-"+goal.id } >
                        <td> <Truncate text={goal.id} size={8} complement=" "/> </td>
                        <td> { goal.l_name } </td>
                        <td> <Truncate text={goal.l_description} size={20}/> </td>
                        <td> { goal.activity } </td>
                        <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" onClick={() => this.edit(goal.id)}>
                                <i className="mdi mdi-lead-pencil"></i>
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => this.deleteActivityGoal(goal.id)} >
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
                    { this.state.activityGoal.id ? "(#"+this.state.activityGoal.id+") " : "" } 
                    Activity Goal
                    { this.state.activityGoal.name ? " - "+this.state.activityGoal.l_name : ""} 
                </h4>
                <div className="table-responsive">
                    <Form onSubmit={ event => event.preventDefault() }>
                        <Form.Group>
                            <label htmlFor="goalNameInput">Name</label>
                            <Form.Control type="text" id="goalNameInput" placeholder="Goal Name" value={this.state.activityGoal.l_name || ''} onChange={this.handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="goalDescriptionInput">Description</label>
                            <Form.Control as="textarea" id="goalDescriptionInput" row={4} value={this.state.activityGoal.l_description || ''} onChange={this.handleChange}/>
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
                <button type="button" className="btn btn-primary" onClick={ () => this.save()}>
                    <i className="mdi mdi-content-save"></i>
                    Save
                </button>
            </Modal.Footer>
        </Modal>
        </div>
        );
    }

}

export default ActivityGoalList;