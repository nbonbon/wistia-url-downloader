const parseIds = require('../index');

test('parseIds should parse ids from a single URL', () => {
    const testUrl = '<p><a href="https://url.com?wvideo=5kcpjz0dgc"><img src="https://embed-ssl.wistia.com/deliveries/123.jpg?image_play_button_size=2x&amp;image_crop_resized=960x317&amp;image_play_button=1&amp;image_play_button_color=434343e0" width="400" height="131.25" style="width: 400px; height: 131.25px;"></a></p><p><a href="https://url.com?wvideo=5kcpjz0dgc">taco.mov</a></p>';
    expect(parseIds(testUrl)).toBe('5kcpjz0dgc');
});

test('parseIds should return undefined for undefined', () => {
    const testUrl = undefined;
    expect(parseIds(testUrl)).toBe(undefined);
});

test('parseIds should return undefined for string without expected pattern match', () => {
    const testUrl = 'KENNEDY';
    expect(parseIds(testUrl)).toBe(undefined);
});

test('parseIds should parse ids from a list of URLs', () => {
    const testUrl = [
        'taco', 
        '<p><a href="https://url.com?wvideo=5kcpjz0dgc"><img src="https://embed-ssl.wistia.com/deliveries/123.jpg?image_play_button_size=2x&amp;image_crop_resized=960x317&amp;image_play_button=1&amp;image_play_button_color=434343e0" width="400" height="131.25" style="width: 400px; height: 131.25px;"></a></p><p><a href="https://url.com?wvideo=5kcpjz0dgc">taco.mov</a></p>', 
        '<p><a href="https://url.com?wvideo=abc123"><img src="https://embed-ssl.wistia.com/deliveries/123.jpg?image_play_button_size=2x&amp;image_crop_resized=960x317&amp;image_play_button=1&amp;image_play_button_color=434343e0" width="400" height="131.25" style="width: 400px; height: 131.25px;"></a></p><p><a href="https://url.com?wvideo=abc123">taco.mov</a></p>'
    ];

    const result = parseIds(testUrl);

    expect(result).toBe(result != null);

    expect(result[0]).toBe(undefined);
    expect(result[1]).toBe('5kcpjz0dgc');
    expect(result[2]).toBe('abc123');

    expect(result.length).toBe(3);
});