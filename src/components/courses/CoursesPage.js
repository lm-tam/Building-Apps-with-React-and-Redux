import React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorAction";
import CourseList from "./CourseList";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import apiStatusReducer from "../../redux/reducers/apiStatusReducer";
import {toast} from "react-toastify";

class CoursesPage extends React.Component {

    state = {
        redirectToAddCoursePage: false
    }

    componentDidMount() {
        const {courses, authors} = this.props;
        if (courses.length === 0) {
            this.props.loadCourses().catch(error => {
                alert("Loading courses failed" + error);
            });
        }
        if (authors.length === 0) {
            this.props.loadAuthors().catch(error => {
                alert("Loading authors failed" + error);
            });
        }
    }

    handleDeleteCourse = async (course) => {
        toast.success("Course deleted");
        try {
            this.props.deleteCourse(course)
        }
        catch (errors) {
            toast.error("Delete failed" + errors.message, { autoClose: false })
        }
    }

    render() {
        return (
            <>
                {this.state.redirectToAddCoursePage && <Redirect to="/course"/>}
                <h2>Course</h2>
                {this.props.loading ? (<Spinner/>) :
                    (<>
                        <button
                            style={{marginBottom: 20}}
                            className="btn btn-primary add-course"
                            onClick={() => this.setState({redirectToAddCoursePage: true})}>Add Course
                        </button>
                        {<CourseList courses={this.props.courses} onDeleteClick={this.handleDeleteCourse}/>}
                    </>)
                }
            </>
        );
    }
}

CoursesPage.propsType = {
    authors: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        courses: state.courses.length === 0 ? [] : state.courses.map(course => {
            return {
                ...course,
                authorName: state.authors.find(a => a.id == course.authorId)?.name
            }
        }),
        authors: state.authors,
        loading: state.apiCallsInProgress > 0,
    }
}

const mapDispatchToProps = {
    createCourse: courseActions.createCourse,
    loadCourses: courseActions.loadCourses,
    loadAuthors: authorActions.loadAuthors,
    deleteCourse: courseActions.deleteCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
