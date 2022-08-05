import React, { Component } from 'react'
import { Badge } from 'react-bootstrap';

export class SemanticBadges extends Component {

    constructor(props){
        super(props)
        if(this.props.badges == null) {
            this.props.badges = []
        }

    }

    render() {
        return (
            <>
                <h6>
                {this.props.badges.map( badge => (
                    <div key={badge}>
                    {( badge === "ODD__Goal_Relevant") && <Badge pill variant="warning" >Goal Relevant</Badge>}
                    {( badge === "ODD__Unavailable") && <Badge pill variant="danger" >Unavailable</Badge>}
                    </div>
                ))}
                </h6>
            </>
        );
    } 
}

export default SemanticBadges;