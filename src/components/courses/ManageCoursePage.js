import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import { loadCourses, saveCourse } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorAction";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageCoursePage({courses, authors, loadCourses, loadAuthors, saveCourse, history, ...props}) {

    const [course, setCourse] = useState({...props.course});
    const [errors, setErrors] = useState({onSave: null});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (courses.length === 0) {
            loadCourses().catch(error => {
                alert("Loading courses failed" + error);
            });
        } else {
            setCourse({...props.course});
        }
        if (authors.length === 0) {
            loadAuthors().catch(error => {
                alert("Loading authors failed" + error);
            });
        }
    }, [props.course])

    function handleOnChange(event) {
        const { name, value } = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }));
    }

    function handleOnSave(event) {
        event.preventDefault();
        if (!isFormValid())
            return;

        setSaving(true);
        saveCourse(course).then(() => {
            toast.success("Course saved.");
            history.push("/courses")
        }).catch(errors => {
            setSaving(false);
            setErrors({onSave: errors.message});
        });
    }

    function isFormValid() {
        const { title, authorId, category } = course;
        const errors = {};
        if (!title)
            errors.title = "Title is required.";
        if (!authorId)
            errors.author = "Author is required.";
        if (!category)
            errors.category = "Category is required.";
        setErrors(errors)
        return Object.keys(errors).length === 0;
    }

    return (
        <CourseForm onChange={handleOnChange} authors={authors} onSave={handleOnSave} course={course} saving={saving} errors={errors}/>
    );
}

ManageCoursePage.propTypes = {
    authors: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    loadCourses: PropTypes.func.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    saveCourse: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
}

function getCourseBySlug(courses, slug) {
    return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
    const slug = ownProps.match.params.slug;
    const course = slug && state.courses.length > 0 ? getCourseBySlug(state.courses, slug) : newCourse;
    return {
        course,
        courses: state.courses,
        authors: state.authors
    }
}

const mapDispatchToProps = {
    loadCourses,
    loadAuthors,
    saveCourse,
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
