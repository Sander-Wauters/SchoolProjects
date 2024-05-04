import useSWR from "swr";
import { getAll } from "../../api";
import AsyncData from "../util/AsyncData";
import BlogPostHeaderList from "./BlogPostHeaderList";

export default function Blog() {
    const { data: blogPosts=[], loadingBlogPosts, blogPostsError } = useSWR("blogPosts", getAll);
    
    return (
        <AsyncData loading={loadingBlogPosts} error={blogPostsError}>
            <BlogPostHeaderList blogPosts={blogPosts}/>
        </AsyncData>
    );
}
