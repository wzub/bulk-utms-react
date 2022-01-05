# Bulk UTM Builder

Just a tool to help build links with UTM parameters in bulk. I built this mostly as a way to learn JavaScript and React. Users can generate multiple links with UTM parameters by entering a URL, choosing which domains to generate links for, and selecting parameters from a list of common presets (or entering their own). The generated links can also be downloaded as a CSV.

* Built with React (refactored from a previous vanilla JS version)
* Uses bit.ly API to allow creating shortlinks
* Authentication using Firebase
* Netlify Function to protect bit.ly API key
