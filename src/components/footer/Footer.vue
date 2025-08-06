<template>
<footer>
    <div class="contact horizontal-flex">
        <div class="github">
            <img src="/src/assets/github_logo.svg">
            <a href="https://github.com/victorradelytskyi">Victor Radelytskyi</a>
        </div>

        <div class="gmail">
            <img src="/src/assets/gmail_logo.svg">
            v.radelytskyi@gmail.com
        </div>
    </div>
</footer>
</template>

<style>
    footer{
        background-color: #F5F5F5;
        margin: 0;
        padding: 10px 0 10px 0;
    }

    .horizontal-flex{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;    
        
    }

    .contact img{
        height: 20px;
        width: auto;
        margin-right: 8px;
        vertical-align: text-top;
    }  

    .contact a:hover{
        color: green;
        transition: 0.3s;
    }

    .github a{
        text-decoration: none;
        color: black;
    }
</style>