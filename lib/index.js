const testcafeReporterXUnit = require('testcafe-reporter-xunit');

module.exports = function testcafeReporterXUnitWistia() {
  return (
    {
      ...testcafeReporterXUnit(),
      _renderErrors(errs, testRunDuration) {
        var _this = this;
        // Add 5s to align with Browserstack video, which includes 5 seconds of TestCafe boot up
        var finishedAtDurationMs = Date.now() - (this.startTime.getTime() - 5000);
        var finishedAtDurationStr = this.moment.duration(finishedAtDurationMs).format('mm:ss', { trim: false });
        var startedAtDurationMs = finishedAtDurationMs - testRunDuration;
        var startedAtDurationStr = this.moment.duration(startedAtDurationMs).format('mm:ss', { trim: false });

        this.report += this.indentString('<failure>\n', 4);
        this.report += this.indentString('<![CDATA[', 4);

        this.report += this.indentString('\n\nTest Started At: ' + startedAtDurationStr + '\n', 6);
        this.report += this.indentString('Test Ended At: ' + finishedAtDurationStr + '\n', 6);

        errs.forEach(function (err, idx) {
          err = _this.formatError(err, idx + 1 + ') ');

          _this.report += '\n';
          _this.report += _this.indentString(err, 6);
          _this.report += '\n';
        });

        this.report += this.indentString(']]>\n', 4);
        this.report += this.indentString('</failure>\n', 4);
      },

      reportTestDone(name, testRunInfo) {
        var hasErr = !!testRunInfo.errs.length;

        if (testRunInfo.unstable) name += ' (unstable)';

        if (testRunInfo.screenshotPath) name += ' (screenshots: ' + testRunInfo.screenshotPath + ')';

        name = this.escapeHtml(name);

        var openTag = '<testcase classname="' + this.currentFixtureName + '" ' + ('name="' + name + '" time="' + testRunInfo.durationMs / 1000 + '">\n');

        this.report += this.indentString(openTag, 2);

        if (testRunInfo.skipped) {
          this.skipped++;
          this.report += this.indentString('<skipped/>\n', 4);
        } else if (hasErr) this._renderErrors(testRunInfo.errs, testRunInfo.durationMs);

        this.report += this.indentString('</testcase>\n', 2);
      },
    }
  );
};
