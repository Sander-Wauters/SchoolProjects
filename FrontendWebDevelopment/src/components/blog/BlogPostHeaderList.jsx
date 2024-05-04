import { Link } from "react-router-dom";
import BlogPostHeader from "./BlogPostHeader";

export default function BlogPostHeaderList({ blogPosts }) {
    return (
        <>
            {blogPosts.map((post) => (
                <Link key={post.id} to={`/post/${post.id}`} style={{textDecoration: "none"}}>
                    <BlogPostHeader key={post.id} {...post} />
                </Link>
            ))} 
        </>
    );
}
