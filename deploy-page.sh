npm run build
cd dist
git init
git add -A
git commit -m "$*"
git push -f https://github.com/braintutor/braintutor.git  master:gh-pages