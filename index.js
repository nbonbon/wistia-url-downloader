const WISTIA_VIDEO_ID_REGEX = /^.*wvideo=(.*)\".*$/

function Download() {
    parseIds()
    getUrls()
    downloadVideos()
}

function parseIds(wistiaUrls) {
    if (typeof wistiaUrls == 'string') {
        return parseId(wistiaUrls);
    } else if(Array.isArray(wistiaUrls)) {
        const result = [];
        wistiaUrls.forEach((url) => {
            if (typeof url == 'string') {
                result.push(parseId(url));
            } else {
                result.push(undefined);
            }
        });
        return result;
    } else {
        return undefined;
    }
}

function parseId(url) {
    if (typeof url == 'string') {
        const matches = url.match(WISTIA_VIDEO_ID_REGEX);
        if (matches) {
            return matches[1];
        }  else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

async function getUrls() {
    const videoId = document.getElementById("videoId").value;
    if (!videoId) {
        alert("Please enter a video ID");
        return;
    }

    const response = await fetch(`https://fast.wistia.net/embed/iframe/${videoId}?videoFoam=true`);
    const text = await response.text();

    // Extract JSON using a regular expression
    const jsonMatch = text.match(/iframeInit\((.*?), \{\}/);
    if (!jsonMatch) {
        alert("Failed to extract JSON data");
        return;
    }

    const jsonData = jsonMatch[1];
    let assets;
    try {
        const data = JSON.parse(jsonData);
        assets = data.assets;
    } catch (error) {
        alert("Failed to parse JSON data");
        return;
    }

    // Update table with asset data
    const tableBody = document.getElementById("assetsTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear previous results

    assets.forEach((asset) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = asset.display_name || "N/A";
        row.insertCell(1).innerText = formatSize(asset.size) || "N/A";
        row.insertCell(2).innerText = asset.width || "N/A";
        row.insertCell(3).innerText = asset.height || "N/A";

        let extension = asset.ext ? "." + asset.ext : ".mp4";
        asset.url && (asset.url = asset.url.replace(".bin", extension));

        const urlCell = row.insertCell(4);
        const urlText = document.createElement("span");
        urlText.innerText = asset.url || "N/A";
        urlCell.appendChild(urlText);

        const copyButtonCell = row.insertCell(5);
        if (asset.url) {
            const copyButton = document.createElement("button");
            copyButton.innerText = "Copy URL";
            copyButton.className = "copy-btn";
            copyButton.onclick = () => copyToClipboard(copyButton, asset.url);
            copyButtonCell.appendChild(copyButton);
        }

        const downloadButtonCell = row.insertCell(6);
        if (asset.url) {
            const downloadButton = document.createElement("a");
            downloadButton.target = "_blank";
            downloadButton.setAttribute("download", asset.display_name || "download");
            downloadButton.innerText = "Download";
            downloadButton.className = "download-btn";
            downloadButton.href = asset.url;
            downloadButton.download = asset.display_name || "download";
            downloadButtonCell.appendChild(downloadButton);
        }
    });
}

function formatSize(size) {
    if (!size) return "N/A";
    if (size >= 1048576) {
        return (size / 1048576).toFixed(2) + " MB";
    } else if (size >= 1024) {
        return (size / 1024).toFixed(2) + " KB";
    } else {
        return size + " bytes";
    }
}

function copyToClipboard(button, text) {
    navigator.clipboard.writeText(text).then(
        () => {
            button.innerText = "Copied";
            button.classList.add("copied");
            setTimeout(() => {
                button.innerText = "Copy URL";
                button.classList.remove("copied");
            }, 3000);
        },
        (err) => {
            console.error("Failed to copy URL: ", err);
        }
    );
}

module.exports = parseIds;